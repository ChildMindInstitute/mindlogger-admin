import { FeedbackNote } from 'modules/Dashboard/api';

export type FeedbackNoteProps = {
  note: FeedbackNote;
  onEdit: (updatedNote: Pick<FeedbackNote, 'id' | 'note'>) => void;
  onDelete: (note: string) => void;
  'data-testid'?: string;
};
