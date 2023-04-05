import uniqueId from 'lodash.uniqueid';
import { FeedbackNote } from './FeedbackNotes.types';

export const mockedNotes = [
  {
    id: uniqueId(),
    author: 'Maks',
    date: new Date(2023, 4, 27, 16, 0, 0),
    content: 'Your participation is voluntary; you do not have to take part.',
  },
  {
    id: uniqueId(),
    author: 'Veronica',
    date: new Date(2023, 2, 23, 2, 0, 0),
    content: 'Once you have started the questionnaire you can stop at any time',
  },
  {
    id: uniqueId(),
    author: 'Maks',
    date: new Date(2023, 3, 23, 2, 0, 0),
    content: 'One note.',
  },
];

export const mockUpdate = (notes: FeedbackNote[], note: FeedbackNote, isRemove = false) => {
  const updatedNoteIndex = notes.findIndex(({ id }) => id === note.id);
  const updatedNotes = [...notes];
  isRemove
    ? updatedNotes.splice(updatedNoteIndex, 1)
    : updatedNotes.splice(updatedNoteIndex, 1, note);

  return updatedNotes;
};
