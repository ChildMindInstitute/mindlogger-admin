export type GetPrivateKey = { appletPassword: string; accountId: string };

export type Encryption = {
  publicKey: string;
  prime: string;
  base: string;
  // accountId: string;// TODO: should be appletData.accountId after M2-1828 will be merged
};

export type GetAppletEncryptionInfo = GetPrivateKey &
  Partial<Omit<Encryption, 'publicKey' | 'privateKey'>>;
