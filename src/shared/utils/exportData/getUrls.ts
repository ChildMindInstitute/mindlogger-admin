import {
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedMediaAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';

export const getDrawingUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  (item.answer as DecryptedDrawingAnswer).value.uri;
export const getMediaUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  (item.answer as DecryptedMediaAnswer)?.value || '';
