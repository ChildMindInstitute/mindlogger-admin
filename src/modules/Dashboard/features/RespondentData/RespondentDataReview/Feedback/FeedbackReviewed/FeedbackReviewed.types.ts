import { DecryptedAnswerData, EncryptedAnswerSharedProps } from 'shared/types';

export type ReviewData = {
  isEdited: boolean;
  reviewer: {
    firstName: string;
    lastName: string;
  };
};

export type Review = EncryptedAnswerSharedProps & ReviewData;

export type Reviewer = ReviewData & {
  review: DecryptedAnswerData<Review>[];
};
