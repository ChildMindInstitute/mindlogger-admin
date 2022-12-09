export type GetPrivateKey = { appletPassword: string; accountId: string };
export type GetAppletEncryptionInfo = GetPrivateKey & {
  prime: number[];
  baseNumber: number[];
};
