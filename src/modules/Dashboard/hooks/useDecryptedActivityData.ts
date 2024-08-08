import { useParams } from 'react-router-dom';

import { applet } from 'shared/state/Applet';
import { Encryption, getParsedEncryptionFromServer, SessionStorageKeys } from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks';
import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';
import { ItemResponseType } from 'shared/consts';
import { getDecryptedAnswers } from 'shared/utils/exportData/getDecryptedAnswers';
import { isProduction } from 'shared/utils/env';

export const getEmptyDecryptedActivityData = () => ({
  decryptedAnswers: [],
  decryptedEvents: [],
});

export const useDecryptedActivityData = (
  dynamicAppletId?: string,
  dynamicEncryption?: Encryption,
) => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(dynamicEncryption ?? encryption);
  const { getAppletPrivateKey } = useEncryptionStorage();
  const privateKey = getAppletPrivateKey(dynamicAppletId ?? appletId);
  const shouldLogDataInDebugMode =
    !isProduction && sessionStorage.getItem(SessionStorageKeys.DebugMode) === 'true';

  if (!encryptionInfoFromServer) return getEmptyDecryptedActivityData;

  return async <T extends EncryptedAnswerSharedProps>(
    answersApiResponse: T,
  ): Promise<DecryptedActivityData<T>> =>
    getDecryptedAnswers(
      answersApiResponse,
      encryptionInfoFromServer,
      privateKey,
      shouldLogDataInDebugMode,
      ItemResponseType,
    );
};
