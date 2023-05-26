import { TextItemAnswer } from '../RespondentDataReview.types';

export const getTextResponse = (answer: TextItemAnswer['answer']) =>
  typeof answer !== 'object' ? answer : answer?.value ?? '';
