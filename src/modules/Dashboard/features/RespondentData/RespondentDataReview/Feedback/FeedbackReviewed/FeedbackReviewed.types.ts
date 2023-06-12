import { Item } from 'shared/state';
import { DecryptedAnswerData } from 'shared/types';

export type Reviewer = {
  isEdited: boolean;
  reviewer: {
    firstName: string;
    lastName: string;
  };
  review: DecryptedAnswerData[];
};

export type Review = {
  isEdited: boolean;
  reviewer: {
    firstName: string;
    lastName: string;
  };
  answer: string;
  itemIds: string[];
  items: Item[];
  reviewerPublicKey: string;
};
