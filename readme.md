# Walrus-JS

Walrus-JS is a JavaScript library for interacting with the Walrus blockchain. It provides a simple and intuitive API for developers to build decentralized applications (dApps).

## Features

- Auto download Walrus bin
- Api to interact with the Walrus blockchain
- Typescript support

## Installation

To install Walrus-JS, use npm or yarn or pnpm:

```bash
npm install walrus-js
yarn add walrus-js
pnpm add walrus-js
```

## Usage

### Create a WalrusClient

```javascript
const walrus = require('./dist/walrusClient.js')
const path = require('path')

const walrusConfigPath = path.join(__dirname, 'client_config.yaml')
const suiWalletConfigPath = path.join(__dirname, 'sui_config.yaml')
const walrusClient = new walrus.WalrusClient(walrusConfigPath, suiWalletConfigPath)
```

### Walrus Info

```javascript
const walrusInfo = await walrusClient.getInfo()
```

### Store blob

```javascript
const res = await walrusClient.storeBlob('/path/to/file', { deletable: false })
```

### Read blob

```javascript
const res = await walrusClient.readBlobToPath('blobId', '/path/to/file')
```

### Blob status

```javascript
const res = await walrusClient.blobStatus({blobId: 'blobId'})
const res = await walrusClient.blobStatus({file: '/path/to/file'})
```

### Delete blob

```javascript
const res = await walrusClient.deleteBlob({blobId: 'blobId'})
```

### List blobs

```javascript
const res = await walrusClient.listBlobs()
```
