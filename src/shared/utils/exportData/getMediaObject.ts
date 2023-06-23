import { DecryptedAnswerData } from 'shared/types';

import { getAnswerValue } from '../getAnswerValue';

export const getMediaObject = ({ answer }: DecryptedAnswerData) =>
  (getAnswerValue(answer) as string).split('.net/')[1];
