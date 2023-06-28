import { DecryptedAnswerData, ExtendedExportAnswerWithoutEncryption } from 'shared/types';

import { getAnswerValue } from '../getAnswerValue';

export const getMediaObject = ({
  answer,
}: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  (getAnswerValue(answer) as string).split('.net/')[1];
