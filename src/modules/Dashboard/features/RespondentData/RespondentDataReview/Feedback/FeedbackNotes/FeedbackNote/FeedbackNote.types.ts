import { Note } from '../FeedbackNotes.types';

export type FeedbackNoteProps = {
  note: Note;
  onEdit: (updatedNote: Pick<Note, 'id' | 'note'>) => void;
  onDelete: (note: string) => void;
  'data-testid'?: string;
};
