import * as crypto from 'crypto-browserify';

import config from './encryption.config';
import {
  Encryption,
  EncryptionParsed,
  GetAppletEncryptionInfo,
  GetPrivateKey,
} from './encryption.types';
import { algorithm, encoding } from './encryption.const';

const defaultBase = [2];

const getPrivateKey = ({ appletPassword, accountId }: GetPrivateKey) => {
  const key1 = crypto.createHash('sha512').update(appletPassword).digest();
  const key2 = crypto.createHash('sha512').update(accountId).digest();

  return `${key1}${key2}`;
};

export const getEncryptionToServer = (appletPassword: string, accountId: string) => {
  const encryptionInfo = getAppletEncryptionInfo({
    appletPassword,
    accountId,
  });

  const encryption: Encryption = {
    publicKey: JSON.stringify(Array.from(encryptionInfo.getPublicKey())),
    prime: JSON.stringify(Array.from(encryptionInfo.getPrime())),
    base: JSON.stringify(Array.from(encryptionInfo.getGenerator())),
    accountId,
  };

  return encryption;
};

export const getParsedEncryptionFromServer = (encryption: Encryption): EncryptionParsed | null => {
  try {
    return {
      publicKey: JSON.parse(encryption.publicKey),
      prime: JSON.parse(encryption.prime),
      base: JSON.parse(encryption.base),
      accountId: encryption.accountId,
    };
  } catch {
    return null;
  }
};

export const getPrime = () => config.primes[Math.floor(Math.random() * 10)];

export const getAppletEncryptionInfo = ({
  appletPassword,
  accountId,
  prime,
  base,
}: GetAppletEncryptionInfo) => {
  const key = crypto.createDiffieHellman(
    Buffer.from(prime || getPrime()) as unknown as number,
    Buffer.from(base || defaultBase),
  );

  key.setPrivateKey(
    Buffer.from(
      getPrivateKey({
        appletPassword,
        accountId,
      }),
    ),
  );
  key.generateKeys();

  return key;
};

export const getAESKey = (
  appletPrivateKey: number[],
  userPublicKey: number[] | string,
  appletPrime: number[],
  base: number[],
) => {
  const key = crypto.createDiffieHellman(Buffer.from(appletPrime), Buffer.from(base));
  key.setPrivateKey(Buffer.from(appletPrivateKey));

  const secretKey = key.computeSecret(Buffer.from(userPublicKey));

  return crypto.createHash('sha256').update(secretKey).digest();
};

export const decryptData = ({ text, key }: { text: string; key: number[] }) => {
  const textParts = text.split(':');
  const initializationVector = Buffer.from(textParts.shift()!, encoding);
  const encryptedText = Buffer.from(textParts.join(':'), encoding);
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), initializationVector);
  const decrypted = decipher.update(encryptedText);

  try {
    return decrypted.toString() + decipher.final('utf8');
  } catch (error) {
    console.error('Decrypt data failed. Text:', text, 'key:', key, 'error:', error);

    return JSON.stringify([{ type: '', time: '', screen: '' }]);
  }
};

export const encryptData = ({ text, key }: { text: string; key: number[] }) => {
  const initializationVector: Buffer = crypto.randomBytes(config.IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), initializationVector);
  let encrypted: Buffer = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${initializationVector.toString(encoding)}:${encrypted.toString(encoding)}`;
};
