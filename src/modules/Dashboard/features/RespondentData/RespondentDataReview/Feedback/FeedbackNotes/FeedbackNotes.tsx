import { FeedbackNote } from './FeedbackNote/FeedbackNote';
import { mockedNotes } from './mock';

export const FeedbackNotes = () => {
  const notes = mockedNotes;

  return (
    <>
      {notes.map((note) => (
        <FeedbackNote key={note.id} note={note} />
      ))}
    </>
  );
};
