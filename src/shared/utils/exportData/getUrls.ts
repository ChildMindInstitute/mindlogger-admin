import {
  DecryptedAnswerData,
  DecryptedMediaAnswer,
  DrawingItemAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';

export const getDrawingUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption, DrawingItemAnswer>) => {
  const drawingAnswer = item.answer;
  if (drawingAnswer.value.uri) return drawingAnswer.value.uri;

  const blob = new Blob([drawingAnswer.value.svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return url;
};
export const getMediaUrl = (item: DecryptedAnswerData) => {
  const answer = item.answer as DecryptedMediaAnswer;
  if (!answer) return '';

  return typeof answer.value === 'string' ? answer.value : '';
};
