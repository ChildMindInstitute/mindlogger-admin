import { AnswerDTO } from 'shared/types';

const parseValue = (value: unknown) => {
  if (value === 0) {
    return '0';
  }
  if ((Array.isArray(value) && !value.length) || !value) {
    return 'null';
  }

  return value;
};

export const getAnswerValue = (answerValue?: AnswerDTO) => {
  if (typeof answerValue === 'object') {
    return parseValue(answerValue?.value ?? answerValue);
  }

  return parseValue(answerValue);
};
