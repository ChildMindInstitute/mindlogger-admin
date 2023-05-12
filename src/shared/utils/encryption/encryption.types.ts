export type GetPrivateKey = { appletPassword: string; accountId: string };

export type Encryption = {
  publicKey: string;
  prime: string;
  base: string;
  accountId: string;
};

export type GetAppletEncryptionInfo = GetPrivateKey &
  Partial<Omit<Encryption, 'publicKey' | 'privateKey'>>;
