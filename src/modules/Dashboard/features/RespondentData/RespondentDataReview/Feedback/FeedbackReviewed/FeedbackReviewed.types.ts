import { DecryptedAnswerData, SharedDecryptedAnswer } from 'shared/types';

export type ReviewData = {
  isEdited: boolean;
  reviewer: {
    firstName: string;
    lastName: string;
  };
};

export type Review = SharedDecryptedAnswer & ReviewData;

export type Reviewer = ReviewData & {
  review: DecryptedAnswerData<Review>[];
};
