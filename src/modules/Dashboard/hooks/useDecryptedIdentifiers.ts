import { useParams } from 'react-router-dom';

import { Identifier as IdentifierResponse } from 'api';
import { applet } from 'shared/state';
import { decryptData, getAESKey, getParsedEncryptionFromServer } from 'shared/utils';
import { useEncryptionStorage } from 'shared/hooks';
import { Identifier } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/RespondentDataSummary.types';

export const useDecryptedIdentifiers = () => {
  const { appletId = '' } = useParams();
  const { result: appletData } = applet.useAppletData() ?? {};
  const encryption = appletData?.encryption;
  const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);
  const { getAppletPrivateKey } = useEncryptionStorage();

  if (!encryptionInfoFromServer) return () => [];

  const { prime, base } = encryptionInfoFromServer;
  const privateKey = getAppletPrivateKey(appletId);

  return (identifiers: IdentifierResponse[]): Identifier[] =>
    identifiers.map(({ identifier, userPublicKey }) => {
      try {
        const key = getAESKey(privateKey, JSON.parse(userPublicKey), prime, base);

        return {
          decryptedValue: decryptData({
            text: identifier,
            key,
          }),
          encryptedValue: identifier,
        };
      } catch {
        console.warn('Error while answer parsing');

        return null;
      }
    }) as Identifier[];
};
