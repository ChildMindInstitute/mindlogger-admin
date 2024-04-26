import { useParams } from 'react-router-dom';

import { Identifier as IdentifierResponse } from 'api';
import { decryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks/useEncryptionStorage';
import { applet } from 'shared/state/Applet';

import { Identifier } from '../../RespondentData.types';

export const useDecryptedIdentifiers = () => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = encryption ? getParsedEncryptionFromServer(encryption) : null;
  const { getAppletPrivateKey } = useEncryptionStorage();

  if (!encryptionInfoFromServer) return null;

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return async (identifiers: IdentifierResponse[]): Promise<Identifier[]> => {
    const identifiersResult: Identifier[] = [];

    for await (const identifierResponse of identifiers) {
      const { identifier, userPublicKey, lastAnswerDate } = identifierResponse;

      // workaround for decrypted identifier data
      if (!userPublicKey) {
        identifiersResult.push({
          decryptedValue: identifier,
          encryptedValue: identifier,
          lastAnswerDate,
        });
        continue;
      }

      try {
        const key = await getAESKey(privateKey, JSON.parse(userPublicKey), prime, base);
        const decryptedValue = await decryptData({
          text: identifier,
          key,
        });

        identifiersResult.push({
          decryptedValue,
          encryptedValue: identifier,
          lastAnswerDate,
        });
      } catch {
        console.warn('Error while answer parsing');
        continue;
      }
    }

    return identifiersResult;
  };
};
