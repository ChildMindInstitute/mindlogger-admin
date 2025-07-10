import { useParams } from 'react-router-dom';

import { ItemResponseType } from 'shared/consts';
import { useEncryptionStorage } from 'shared/hooks';
import { applet } from 'shared/state/Applet';
import { DecryptedActivityData, EncryptedAnswerSharedProps } from 'shared/types';
import { checkIfShouldLogging, Encryption, getParsedEncryptionFromServer } from 'shared/utils';
import { getDecryptedAnswers } from 'shared/utils/exportData/getDecryptedAnswers';

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
  const shouldLogDataInDebugMode = checkIfShouldLogging();

  if (!encryptionInfoFromServer) return getEmptyDecryptedActivityData;

  return async <T extends EncryptedAnswerSharedProps>(
    answersApiResponse: T,
  ): Promise<DecryptedActivityData<T>> => {
    const privateKey = getAppletPrivateKey(dynamicAppletId ?? appletId);

    return getDecryptedAnswers(
      answersApiResponse,
      encryptionInfoFromServer,
      privateKey,
      shouldLogDataInDebugMode,
      ItemResponseType,
    );
  };
};
