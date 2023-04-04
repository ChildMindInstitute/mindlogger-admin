import { FeedbackNote } from '../FeedbackNotes.types';

export type FeedbackNoteProps = {
  note: FeedbackNote;
  onEdit: (updatedNote: FeedbackNote) => void;
  onDelete: (note: FeedbackNote) => void;
};
