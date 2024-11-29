const walrus = require('./dist/walrusClient.js');
const path = require('path')

async function test() {
	const walrusConfigPath = path.join(__dirname, '__tests__', 'client_config.yaml')
	const suiWalletConfigPath = path.join(__dirname, '__tests__', 'sui_config.yaml')
	const walrusClient = new walrus.WalrusClient(walrusConfigPath, suiWalletConfigPath)
	// const res = await walrusClient.storeBlob('/home/jerry/test.txt', { deletable: true })
	// const res = await walrusClient.blobStatus({
	// 	blobId: 'MpEK-1zvXlj5TdgkSHCkk1Rrly9aLurLlGetvb6vP6w'
	// })
	// const res = await walrusClient.readBlobToPath('MpEK-1zvXlj5TdgkSHCkk1Rrly9aLurLlGetvb6vP6w', '/home/jerry/test11.txt')
	// const res = await walrusClient.convertBlobId('68350551874214298609141993084577810592398064652161844778127090962099065825282')
	const res = await walrusClient.listBlobs({ includeExpired: true })
	// const res = await walrusClient.deleteBlob({
	// 	blobId: '_E2Uy8z9X6aCxYD9q38MH_WG7BP_ZV23MRlPsTOzfdw'
	// })
	console.log(res)
	// console.log(process.cwd())
}

test()