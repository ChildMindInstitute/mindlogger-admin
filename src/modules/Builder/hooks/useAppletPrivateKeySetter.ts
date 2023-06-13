import { Encryption, getAppletEncryptionInfo, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionCheckFromStorage } from 'shared/hooks';

export const useAppletPrivateKeySetter = () => {
  const { setAppletPrivateKey } = useEncryptionCheckFromStorage();

  return ({
    appletPassword,
    encryption,
    appletId,
  }: {
    appletPassword: string;
    encryption: Encryption;
    appletId: string;
  }) => {
    const encryptionParsed = getParsedEncryptionFromServer(encryption);
    if (!encryptionParsed || !appletId || !appletPassword) return;

    const { publicKey, ...rest } = encryptionParsed;
    const encryptionInfoGenerated = getAppletEncryptionInfo({
      appletPassword,
      ...rest,
    });
    setAppletPrivateKey(appletId, Array.from(encryptionInfoGenerated.getPrivateKey()));
  };
};
