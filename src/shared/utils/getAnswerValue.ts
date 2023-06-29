import { AnswerDTO } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

export const getAnswerValue = (answerValue: AnswerDTO) => {
  if (typeof answerValue === 'object') {
    return answerValue?.value || '';
  }

  return answerValue || '';
};
