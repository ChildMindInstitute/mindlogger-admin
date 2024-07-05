import { useRef } from 'react';

import { Spinner } from 'shared/components/Spinner';

import { FeedbackNote } from './FeedbackNote';
import { StyledContainer, StyledNoteListContainer } from './FeedbackNotes.styles';
import { FeedbackNotesProps } from './FeedbackNotes.types';
import { FeedbackNotesForm } from './FeedbackNotesForm';
import { dataTestId } from './FeedbackNotes.const';
import { useFeedbackNotes } from './FeedbackNotes.hooks';

export const FeedbackNotes = ({ entity }: FeedbackNotesProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { notes, isLoading, handleSubmit, handleNoteEdit, handleNoteDelete } = useFeedbackNotes({
    entity,
  });

  return (
    <StyledContainer ref={containerRef} data-testid={dataTestId}>
      <FeedbackNotesForm
        containerRef={containerRef}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        data-testid={dataTestId}
      />
      <StyledNoteListContainer>
        {isLoading ? (
          <Spinner noBackground />
        ) : (
          <>
            {notes.map((note, index) => (
              <FeedbackNote
                key={note.id}
                note={note}
                onEdit={handleNoteEdit}
                onDelete={handleNoteDelete}
                data-testid={`${dataTestId}-note-${index}`}
              />
            ))}
          </>
        )}
      </StyledNoteListContainer>
    </StyledContainer>
  );
};
