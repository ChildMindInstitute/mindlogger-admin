import { useContext, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { useAsync } from 'shared/hooks/useAsync';
import { Spinner } from 'shared/components/Spinner';
import {
  createAnswerNoteApi,
  deleteAnswerNoteApi,
  editAnswerNoteApi,
  getAnswersNotesApi,
} from 'modules/Dashboard/api';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback';

import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { FeedbackNote } from './FeedbackNote';
import { StyledContainer, StyledNoteListContainer } from './FeedbackNotes.styles';
import { FeedbackNote as FeedbackNoteType, FeedbackNotesProps } from './FeedbackNotes.types';
import { FeedbackNotesForm } from './FeedbackNotesForm';

export const FeedbackNotes = ({ activity }: FeedbackNotesProps) => {
  const [notes, setNotes] = useState<FeedbackNoteType[]>([]);
  const appletId = useParams()?.appletId || '';
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const containerRef = useRef<HTMLElement | null>(null);
  const dataTestid = 'respondents-summary-feedback-notes';

  const { isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const { setValue, handleSubmit } = useFormContext<FeedbackForm>();

  const { execute: getAnswersNotes, isLoading: notesLoading } = useAsync(
    getAnswersNotesApi,
    (res) => res?.data?.result && setNotes(res.data.result),
  );

  const updateListOfNotes = async () => {
    if (!appletId || !answerId || !activityId) return;

    await getAnswersNotes({ appletId, answerId, activityId, params: {} });
  };

  const { execute: createAnswerNote, isLoading: createNoteLoading } = useAsync(
    createAnswerNoteApi,
    async () => {
      setValue('newNote', '');
      await updateListOfNotes();
    },
  );
  const { execute: editAnswerNote, isLoading: editNoteLoading } = useAsync(
    editAnswerNoteApi,
    updateListOfNotes,
  );
  const { execute: deleteAnswerNote, isLoading: deleteNoteLoading } = useAsync(
    deleteAnswerNoteApi,
    updateListOfNotes,
  );

  const isLoading = notesLoading || editNoteLoading || deleteNoteLoading || createNoteLoading;
  const activityId = activity?.id ?? '';

  const handleNoteEdit = (updatedNote: Pick<FeedbackNoteType, 'id' | 'note'>) => {
    if (!appletId || !answerId || !activityId) return;

    editAnswerNote({
      appletId,
      answerId,
      activityId,
      noteId: updatedNote.id,
      note: updatedNote.note,
    });
  };

  const handleNoteDelete = (noteId: string) => {
    if (!appletId || !answerId || !activityId) return;

    deleteAnswerNote({ appletId, answerId, activityId, noteId });
  };

  const addNewNote = ({ newNote }: FeedbackForm) => {
    if (!newNote.trim() || !appletId || !answerId || !activityId) return;

    createAnswerNote({ appletId, answerId, activityId, note: newNote });
  };

  useEffect(() => {
    if (!appletId || !answerId || !isFeedbackOpen || !activityId || !getAnswersNotes) return;

    getAnswersNotes({ appletId, answerId, activityId, params: {} });
  }, [appletId, answerId, isFeedbackOpen, activityId, getAnswersNotes]);

  return (
    <StyledContainer ref={containerRef} data-testid={dataTestid}>
      <FeedbackNotesForm
        containerRef={containerRef}
        onSubmit={handleSubmit(addNewNote)}
        isLoading={isLoading}
        data-testid={dataTestid}
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
                data-testid={`${dataTestid}-note-${index}`}
              />
            ))}
          </>
        )}
      </StyledNoteListContainer>
    </StyledContainer>
  );
};
