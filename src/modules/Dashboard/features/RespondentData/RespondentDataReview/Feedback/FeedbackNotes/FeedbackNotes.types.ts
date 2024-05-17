import { ReviewActivity } from 'modules/Dashboard/api';

type FullName = {
  firstName: string;
  lastName: string;
};

export type FeedbackNote = {
  id: string;
  user: FullName;
  note: string;
  createdAt: string;
};

export type FeedbackNotesProps = { activity: ReviewActivity };
