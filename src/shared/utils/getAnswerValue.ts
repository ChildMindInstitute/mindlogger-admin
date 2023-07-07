import { AnswerDTO } from 'shared/types';

export const getAnswerValue = (answerValue: AnswerDTO) => {
  if (typeof answerValue === 'object') {
    return answerValue?.value || '';
  }

  return answerValue || '';
};
