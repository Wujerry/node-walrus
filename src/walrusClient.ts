import { ChildProcess, spawn } from 'child_process'
import path from 'path'
import {
  StoreResponse,
  WalrusInfo,
  StoreConfig,
  BlobStatusConfig,
  BlobStatusResponse,
  BlobListItem,
  ListBlobsConfig,
  DeleteConfig,
  DeleteResponse,
} from './types'
import { configToArgs } from './util'
import fs from 'fs'

/**
 * The `WalrusClient` class provides an interface to interact with the Walrus command-line tool.
 * It allows for various operations such as storing blobs, retrieving blob status, reading blobs,
 * converting blob IDs, listing blobs, and deleting blobs.
 *
 * @class WalrusClient
 *
 * @param {string} [configPath] - Optional path to the configuration file.
 * @param {string} [walletPath] - Optional path to the wallet file.
 * @param {boolean} [jsonOutput=true] - Flag to enable JSON output.
 * @param {number} [gasBudget=100000000] - Optional gas budget for operations.
 *
 */
class WalrusClient {
  private configPath: string | undefined
  private walletPath: string | undefined
  private gasBudget: number = 100000000
  private jsonOutput: boolean = true
  private walrusBinaryPath: string
  private baseArgs: string[] = []

  constructor(configPath?: string, walletPath?: string, jsonOutput: boolean = true, gasBudget?: number) {
    this.configPath = configPath
    this.walletPath = walletPath
    this.jsonOutput = jsonOutput

    // set the path to the walrus binary
    this.walrusBinaryPath = path.join(process.cwd(), 'node_modules', 'node-walrus', 'bin', 'walrusjs')

    if (this.configPath) {
      this.baseArgs.push('-c')
      this.baseArgs.push(this.configPath)
    }
    if (this.walletPath) {
      this.baseArgs.push('-w')
      this.baseArgs.push(this.walletPath)
    }
    if (this.jsonOutput) {
      this.baseArgs.push('--json')
    }
    if (this.gasBudget) {
      this.gasBudget = gasBudget ?? 100000000
      this.baseArgs.push('-g')
      this.baseArgs.push(this.gasBudget.toString())
    }
  }

  /**
   * Sets the JSON output flag.
   * @param {boolean} enable - Flag to enable or disable JSON output.
   */
  public setJsonOutput(enable: boolean) {
    this.jsonOutput = enable
  }

  /**
   * Retrieves the version of the Walrus tool.
   * @returns {Promise<string>} - The version string.
   */
  public async getVersion(): Promise<string> {
    return await this.runCommandAsync('--version')
  }

  /**
   * Retrieves information from the Walrus tool.
   * @returns {Promise<WalrusInfo>} - The information object.
   */
  public async getInfo(): Promise<WalrusInfo> {
    const res = await this.runCommandAsync('info')
    return JSON.parse(res)
  }

  /**
   * Stores a blob using the Walrus tool.
   * @param {string} filePath - Path to the file to be stored.
   * @param {StoreConfig} [config] - Optional configuration for storing the blob.
   * @param {string[]} [args] - Additional arguments for the command.
   * @returns {Promise<StoreResponse>} - The response object.
   */
  public async storeBlob(filePath: string, config?: StoreConfig, args: string[] = []): Promise<StoreResponse> {
    const res = await this.runCommandAsync('store', [filePath, ...configToArgs(config, 'store'), ...args])
    return JSON.parse(res)
  }

  /**
   * Retrieves the status of a blob.
   * @param {BlobStatusConfig} config - Configuration for retrieving the blob status.
   * @param {string[]} [args] - Additional arguments for the command.
   * @returns {Promise<BlobStatusResponse>} - The response object.
   */
  public async blobStatus(config: BlobStatusConfig, args: string[] = []): Promise<BlobStatusResponse> {
    const res = await this.runCommandAsync('blob-status', [...configToArgs(config, 'blobStatus'), ...args])
    return JSON.parse(res)
  }

  /**
   * Reads a blob and writes it to a specified path.
   * @param {string} blobId - The ID of the blob to be read.
   * @param {string} path - The path where the blob should be written.
   * @returns {Promise<string>} - The path where the blob was written.
   */
  public readBlobToPath(blobId: string, path: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const resultStream = this.readBlobAsStream(blobId)
      if (!resultStream) return reject(new Error('Error reading blob'))
      const stdoutWriteStream = fs.createWriteStream(path)
      resultStream.on('data', (data) => {
        stdoutWriteStream.write(data)
      })
      resultStream.on('end', () => {
        stdoutWriteStream.end()
        resolve(path)
      })
    })
  }

  /**
   * Reads a blob as a stream.
   * @param {string} blobId - The ID of the blob to be read.
   * @returns {ChildProcess['stdout']} - The stdout stream of the child process.
   */
  public readBlobAsStream(blobId: string) {
    const res = this.runCommand('read', [blobId])
    return res.stdout
  }

  /**
   * Converts a decimal blob ID to a Walrus blob ID.
   * @param {string} decimalBlobId - The decimal blob ID to be converted.
   * @returns {Promise<string>} - The converted blob ID.
   */
  public async convertBlobId(decimalBlobId: string): Promise<string> {
    return await this.runCommandAsync('convert-blob-id', [decimalBlobId])
  }

  /**
   * Lists blobs using the Walrus tool.
   * @param {ListBlobsConfig} [config] - Optional configuration for listing blobs.
   * @param {string[]} [args] - Additional arguments for the command.
   * @returns {Promise<BlobListItem[]>} - The list of blobs.
   */
  public async listBlobs(config?: ListBlobsConfig, args: string[] = []): Promise<BlobListItem[]> {
    const res = await this.runCommandAsync('list-blobs', [...configToArgs(config, 'listBlobs'), ...args])
    return JSON.parse(res)
  }

  /**
   * Deletes a blob using the Walrus tool.
   * @param {DeleteConfig} config - Configuration for deleting the blob.
   * @param {string[]} [args] - Additional arguments for the command.
   * @returns {Promise<DeleteResponse>} - The response object.
   */
  public async deleteBlob(config: DeleteConfig, args: string[] = []): Promise<DeleteResponse> {
    const res = await this.runCommandAsync('delete', [...configToArgs(config, 'deleteBlob'), ...args])
    return JSON.parse(res)
  }

  /**
   * Runs a Walrus command asynchronously.
   * @param {string} command - The command to be executed.
   * @param {string[]} [args] - Additional arguments for the command.
   * @returns {Promise<string>} - The stdout output of the command.
   */
  public async runCommandAsync(command: string, args: string[] = []): Promise<string> {
    return new Promise((resolve, reject) => {
      const allArgs = [...this.baseArgs, command, ...args]
      const process = spawn(this.walrusBinaryPath, allArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''

      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout)
        } else {
          reject(new Error(`Error executing command: ${stderr}`))
        }
      })

      process.on('error', (error) => {
        reject(new Error(`Process failed: ${error.message}`))
      })
    })
  }

  /**
   * Runs a Walrus command synchronously.
   * @param {string} command - The command to be executed.
   * @param {string[]} [args] - Additional arguments for the command.
   * @returns {ChildProcess} - The child process of the command.
   */
  public runCommand(command: string, args: string[] = []): ChildProcess {
    const allArgs = [...this.baseArgs.filter((a) => a !== '--json'), command, ...args]
    const childProcess = spawn(this.walrusBinaryPath, allArgs)
    return childProcess
  }
}

export { WalrusClient }
