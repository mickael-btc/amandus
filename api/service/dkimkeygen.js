//@ts-check
const { generateKeyPairSync } = require("crypto");
var DKIMKey = require("dkim-key");

module.exports = () => {
  let { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048, // 2048 bits key
    publicKeyEncoding: {
      type: "spki", // recommended by nodejs
      format: "pem", // key format
    },
    privateKeyEncoding: {
      type: "pkcs8", // recommended by nodejs
      format: "pem", // key format
    },
  });

  privateKey = privateKey.replace(/\n/g, ""); // remove trailing newline
  publicKey = publicKey.replace(/\n/g, ""); // remove trailing newline

  // pattern to remove the '-----BEGIN PUBLIC KEY-----' and '-----END PUBLIC KEY-----'
  const pattern = /-----BEGIN PUBLIC KEY-----(.*)-----END PUBLIC KEY-----/g;
  const clearPublicKey = pattern.exec(publicKey)[1]; // get the public key without gibberish

  const dkimRecord = new DKIMKey({
    version: "DKIM1",
    type: "rsa",
    key: clearPublicKey,
  }).toString();

  return {
    privateKey: privateKey,
    publicKey: publicKey,
    dkimRecord: dkimRecord,
  };
};

