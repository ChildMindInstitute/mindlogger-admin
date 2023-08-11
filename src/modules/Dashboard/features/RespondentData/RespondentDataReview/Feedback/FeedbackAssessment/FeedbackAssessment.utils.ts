import { AnswerDTO } from 'shared/types';

import { AssessmentFormItem } from '../Feedback.types';

export const checkAnswerValue = (value: string | number | string[]) => {
  if (Array.isArray(value)) return !value.length;

  return !value?.toString().length;
};

export const formatAssessmentAnswers = (assessmentItems: AssessmentFormItem[]) =>
  assessmentItems.reduce(
    (answers: AnswerDTO[], item) => [
      ...answers,
      {
        value: item.answers,
        text: null,
        edited: item.edited || null,
      } as AnswerDTO,
    ],
    [],
  );
