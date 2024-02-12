import config from './encryption.config';
import {
  Encryption,
  EncryptionParsed,
  GetAppletEncryptionInfo,
  GetPrivateKey,
} from './encryption.types';
import { algorithm, encoding } from './encryption.const';

const defaultBase = [2];

export const getPrivateKey = async ({ appletPassword, accountId }: GetPrivateKey) => {
  const { createHash } = await import('crypto-browserify');
  const key1 = createHash('sha512').update(appletPassword).digest();
  const key2 = createHash('sha512').update(accountId).digest();

  return `${key1}${key2}`;
};

export const getEncryptionToServer = async (appletPassword: string, accountId: string) => {
  const encryptionInfo = await getAppletEncryptionInfo({
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

export const getAppletEncryptionInfo = async ({
  appletPassword,
  accountId,
  prime,
  base,
}: GetAppletEncryptionInfo) => {
  const { createDiffieHellman } = await import('crypto-browserify');
  const key = createDiffieHellman(
    Buffer.from(prime || getPrime()) as unknown as number,
    Buffer.from(base || defaultBase),
  );

  key.setPrivateKey(
    Buffer.from(
      await getPrivateKey({
        appletPassword,
        accountId,
      }),
    ),
  );
  key.generateKeys();

  return key;
};

export const getAESKey = async (
  appletPrivateKey: number[],
  userPublicKey: number[] | string,
  appletPrime: number[],
  base: number[],
) => {
  const { createDiffieHellman, createHash } = await import('crypto-browserify');
  const key = createDiffieHellman(Buffer.from(appletPrime), Buffer.from(base));
  key.setPrivateKey(Buffer.from(appletPrivateKey));

  const secretKey = key.computeSecret(Buffer.from(userPublicKey));

  return createHash('sha256').update(secretKey).digest();
};

export const decryptData = async ({ text, key }: { text: string; key: number[] }) => {
  const { createDecipheriv } = await import('crypto-browserify');
  const textParts = text.split(':');
  const initializationVector = Buffer.from(textParts.shift()!, encoding);
  const encryptedText = Buffer.from(textParts.join(':'), encoding);
  const decipher = createDecipheriv(algorithm, Buffer.from(key), initializationVector);
  const decrypted = decipher.update(encryptedText);

  try {
    return decrypted.toString() + decipher.final('utf8');
  } catch (error) {
    console.error('Decrypt data failed. Text:', text, 'key:', key, 'error:', error);

    return JSON.stringify([{ type: '', time: '', screen: '' }]);
  }
};

export const encryptData = async ({ text, key }: { text: string; key: number[] }) => {
  const { createCipheriv, randomBytes } = await import('crypto-browserify');
  const initializationVector: Buffer = randomBytes(config.IV_LENGTH);
  const cipher = createCipheriv(algorithm, Buffer.from(key), initializationVector);
  let encrypted: Buffer = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${initializationVector.toString(encoding)}:${encrypted.toString(encoding)}`;
};

export const publicEncrypt = async (text: string, key: string) => {
  const { publicEncrypt } = await import('crypto-browserify');

  return publicEncrypt(Buffer.from(key), Buffer.from(text)).toString('base64');
};
