import {
  DecryptedAnswerData,
  DecryptedMediaAnswer,
  DecryptedUnityAnswer,
  DrawingItemAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';

export const getDrawingUrl = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption, DrawingItemAnswer>,
) => {
  const drawingAnswer = item.answer;
  if (drawingAnswer.value.uri) return drawingAnswer.value.uri;

  const blob = new Blob([drawingAnswer.value.svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return url;
};
export const getMediaUrl = (item: DecryptedAnswerData) => {
  const answer = item.answer as DecryptedMediaAnswer;
  if (!answer) return '';

  if (typeof answer.value === 'string') {
    return answer.value;
  } else if (Array.isArray(answer.value)) {
    return answer.value[0];
  }

  return '';
};

export const getUnityMediaUrls = (item: DecryptedAnswerData) => {
  const answer = item.answer as DecryptedUnityAnswer;
  if (!answer || !answer.value?.taskData?.length) return [];

  return answer.value.taskData;
};
