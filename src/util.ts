const options = {
  store: {
    epochs: ['--epochs', true],
    dryRun: ['--dry-run', false],
    force: ['--force', false],
    deletable: ['--deletable', false],
  },
  blobStatus: {
    blobId: ['--blob-id', true],
    file: ['--file', true],
    timeout: ['--timeout', true],
    rpcUrl: ['--rpc-url', true],
  },
  listBlobs: {
    includeExpired: ['--include-expired', false],
  },
  deleteBlob: {
    blobId: ['--blob-id', true],
    file: ['--file', true],
    objectId: ['--object-id', true],
  },
}

export function configToArgs(config: any, type: 'store' | 'blobStatus' | 'listBlobs' | 'deleteBlob') {
  if (!config) return []
  const cmdArgs = []
  for (const [key, value] of Object.entries(options[type])) {
    if (config[key]) {
      cmdArgs.push(value[0])
      if (value[1]) {
        cmdArgs.push(config[key])
      }
    }
  }
  return cmdArgs
}
