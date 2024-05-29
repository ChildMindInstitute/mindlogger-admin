import { SelectedEntity } from '../Feedback.types';

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

export type FeedbackNotesProps = { entity: SelectedEntity };
