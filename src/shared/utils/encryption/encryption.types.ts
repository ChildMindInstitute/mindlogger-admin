export type GetPrivateKey = { appletPassword: string; accountId: string };

export type Encryption = {
  publicKey: number[];
  privateKey: number[];
  prime: number[];
  base: number[];
  accountId: string;
};

export type GetAppletEncryptionInfo = GetPrivateKey &
  Partial<Omit<Encryption, 'publicKey' | 'privateKey'>>;
