const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('https');

const binUrls = {
	'ubuntu-x86_64': 'https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-ubuntu-x86_64',
	'ubuntu-x86_64-generic': 'https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-ubuntu-x86_64-generic',
	'macos-arm64': 'https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-macos-arm64',
	'macos-x86_64': 'https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-macos-x86_64',
	'windows-x86_64.exe': 'https://storage.googleapis.com/mysten-walrus-binaries/walrus-testnet-latest-windows-x86_64.exe'
};

const platform = os.platform();
const arch = os.arch();

let binKey = '';
if (platform === 'linux' && arch === 'x64') {
	binKey = 'ubuntu-x86_64';
} else if (platform === 'linux' && arch === 'x64') {
	binKey = 'ubuntu-x86_64-generic';
} else if (platform === 'darwin' && arch === 'arm64') {
	binKey = 'macos-arm64';
} else if (platform === 'darwin' && arch === 'x64') {
	binKey = 'macos-x86_64';
} else if (platform === 'win32' && arch === 'x64') {
	binKey = 'windows-x86_64.exe';
} else {
	console.error('Unsupported platform or architecture');
	process.exit(1);
}

const binUrl = binUrls[binKey];
const binDir = path.join(__dirname, 'bin');

if (!fs.existsSync(binDir)) {
	fs.mkdirSync(binDir);
}

const downloadBinary = (url, dest) => {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(dest);
		https.get(url, (response) => {
			if (response.statusCode !== 200) {
				return reject(`Failed to get '${url}' (${response.statusCode})`);
			}

			response.pipe(file);

			file.on('finish', () => {
				file.close();
				console.log(`Downloaded binary to ${dest}`);
				resolve();
			});

			file.on('error', (err) => {
				fs.unlink(dest, () => reject(err));
			});
		}).on('error', (err) => {
			fs.unlink(dest, () => reject(err));
		});
	});
};

const fileName = 'walrusjs';
const filePath = path.join(binDir, fileName);

downloadBinary(binUrl, filePath)
	.then(() => {
		console.log(`Binary saved to ${filePath}`);
	})
	.catch((err) => {
		console.error('Error downloading binary:', err);
		process.exit(1);
	});
