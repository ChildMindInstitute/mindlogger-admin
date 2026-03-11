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
  } else if (answer.value && typeof answer.value === 'object' && 'uri' in answer.value) {
    return answer.value.uri || '';
  }

  return '';
};

export const getUnityMediaUrls = (item: DecryptedAnswerData) => {
  const answer = item.answer as DecryptedUnityAnswer;
  if (!answer || !answer.value) return [];

  // Handle direct array of S3 URLs (actual format from mobile app decryption)
  if (Array.isArray(answer.value)) {
    return answer.value.filter((url): url is string => typeof url === 'string');
  }

  if (typeof answer.value === 'string') return [];

  // Handle { taskData: string[] } format (after URL presigning replaces the value)
  if ('taskData' in answer.value && answer.value.taskData?.length) {
    return answer.value.taskData;
  }

  return [];
};
