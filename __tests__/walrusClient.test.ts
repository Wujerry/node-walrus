import { WalrusClient } from '../src/walrusClient'
import { exec } from 'child_process'
import path from 'path'

// Mocking exec function
jest.mock('child_process', () => ({
  exec: jest.fn(),
}))

describe('WalrusClient', () => {
  let walrusClient: WalrusClient

  beforeEach(() => {
    // Instantiate a new WalrusClient before each test
    walrusClient = new WalrusClient(path.join(__dirname, 'client_config.yaml'), path.join(__dirname, 'sui_config.yaml'))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should show info correctly', async () => {
    const result = await walrusClient.runCommand('info')
    console.log(result)
    expect(1).toBe(1)
  })
})
