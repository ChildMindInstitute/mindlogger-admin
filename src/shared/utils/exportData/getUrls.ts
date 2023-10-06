import { DecryptedAnswerData, DecryptedDrawingAnswer, DecryptedMediaAnswer } from 'shared/types';

export const getDrawingUrl = (item: DecryptedAnswerData) =>
  (item.answer as DecryptedDrawingAnswer).value.uri;
export const getMediaUrl = (item: DecryptedAnswerData) =>
  (item.answer as DecryptedMediaAnswer)?.value || '';
