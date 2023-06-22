import { DecryptedAnswerData, DecryptedAnswerSharedProps } from 'shared/types';

export type ReviewData = {
  isEdited: boolean;
  reviewer: {
    firstName: string;
    lastName: string;
  };
};

export type Review = DecryptedAnswerSharedProps & ReviewData;

export type Reviewer = ReviewData & {
  review: DecryptedAnswerData<Review>[];
};
