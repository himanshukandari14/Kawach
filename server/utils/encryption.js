const crypto = require('crypto');

const decryptFile = (encryptedData, keyHex, ivHex) => {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};

module.exports = { decryptFile }; 