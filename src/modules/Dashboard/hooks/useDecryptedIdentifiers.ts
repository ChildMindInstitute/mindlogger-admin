import { useParams } from 'react-router-dom';

import { Identifier as IdentifierResponse } from 'api';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/RespondentDataSummary.types';
import { useEncryptionStorage } from 'shared/hooks';
import { applet } from 'shared/state';
import { decryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';

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
      const { identifier, userPublicKey } = identifierResponse;

      // workaround for decrypted identifier data
      if (!userPublicKey) {
        identifiersResult.push({
          decryptedValue: identifier,
          encryptedValue: identifier,
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
        });
      } catch {
        console.warn('Error while answer parsing');
        continue;
      }
    }

    return identifiersResult;
  };
  /*
  return async (identifiers: IdentifierResponse[]): Promise<Identifier[]> =>
    identifiers.map(({ identifier, userPublicKey }) => {
      // workaround for decrypted identifier data
      if (!userPublicKey) {
        return {
          decryptedValue: identifier,
          encryptedValue: identifier,
        };
      }

      try {
        const key = await getAESKey(privateKey, JSON.parse(userPublicKey), prime, base);
        const decryptedValue = await decryptData({
          text: identifier,
          key,
        });

        return {
          decryptedValue,
          encryptedValue: identifier,
        };
      } catch {
        console.warn('Error while answer parsing');

        return null;
      }
    }) as Identifier[];
    */
};
