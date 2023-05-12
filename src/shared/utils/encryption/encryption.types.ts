export type GetPrivateKey = { appletPassword: string; accountId: string };

export type Encryption = {
  publicKey: string;
  prime: string;
  base: string;
  accountId: string;
};
export type EncryptionParsed = {
  publicKey: number[];
  prime: number[];
  base: number[];
  accountId: string;
};

export type GetAppletEncryptionInfo = GetPrivateKey & Partial<Omit<EncryptionParsed, 'publicKey'>>;
