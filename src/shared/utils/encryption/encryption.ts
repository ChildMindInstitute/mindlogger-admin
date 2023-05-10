import * as crypto from 'crypto-browserify';

import config from './encryption.config';
import { Encryption, GetAppletEncryptionInfo, GetPrivateKey } from './encryption.types';

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
    publicKey: Array.from(encryptionInfo.getPublicKey()),
    privateKey: Array.from(encryptionInfo.getPrivateKey()),
    prime: Array.from(encryptionInfo.getPrime()),
    base: Array.from(encryptionInfo.getGenerator()),
    accountId,
  };

  return JSON.stringify(encryption);
};

export const getParsedEncryptionFromServer = (encryption: string): Encryption | null => {
  try {
    return JSON.parse(encryption);
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
