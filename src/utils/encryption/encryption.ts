import * as crypto from 'crypto-browserify';

import config from './encryption.config';
import { GetAppletEncryptionInfo, GetPrivateKey } from './encryption.types';

const base = [2];

const getPrivateKey = ({ appletPassword, accountId }: GetPrivateKey) => {
  const key1 = crypto.createHash('sha512').update(appletPassword).digest();
  const key2 = crypto.createHash('sha512').update(accountId).digest();

  return `${key1}${key2}`;
};

export const getAppletEncryptionInfo = ({
  appletPassword,
  accountId,
  prime,
  baseNumber,
}: GetAppletEncryptionInfo) => {
  const key = crypto.createDiffieHellman(
    Buffer.from(prime || config.primes[Math.floor(Math.random() * 10)]) as unknown as number,
    Buffer.from(baseNumber || base),
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
