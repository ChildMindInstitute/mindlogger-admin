import { useContext, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import { Spinner } from 'shared/components';
import {
  DatavizActivity,
  createAnswerNoteApi,
  deleteAnswerNoteApi,
  editAnswerNoteApi,
  getAnswersNotesApi,
} from 'api';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback';
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';

import { FeedbackNote } from './FeedbackNote';
import { NOTE_ROWS_COUNT } from './FeedbackNotes.const';
import { StyledContainer, StyledForm, StyledNoteListContainer } from './FeedbackNotes.styles';
import { FeedbackNote as FeedbackNoteType } from './FeedbackNotes.types';

export const FeedbackNotes = ({ activity }: { activity: DatavizActivity }) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<FeedbackNoteType[]>([]);
  const appletId = useParams()?.appletId || '';
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const containerRef = useRef<HTMLElement | null>(null);
  const isFormSticky = useHeaderSticky(containerRef);
  const dataTestid = 'respondents-summary-feedback-notes';

  const { isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const { control, setValue, handleSubmit } = useFormContext<FeedbackForm>();

  const { execute: getAnswersNotes, isLoading } = useAsync(
    getAnswersNotesApi,
    (res) => res?.data?.result && setNotes(res.data.result),
  );

  const updateListOfNotes = async () => {
    if (!answerId) return;
    await getAnswersNotes({ appletId, answerId, activityId, params: {} });
  };

  const { execute: createAnswerNote } = useAsync(createAnswerNoteApi, () => {
    setValue('newNote', '');
    updateListOfNotes();
  });
  const { execute: editAnswerNote } = useAsync(editAnswerNoteApi, updateListOfNotes);
  const { execute: deleteAnswerNote } = useAsync(deleteAnswerNoteApi, updateListOfNotes);

  const activityId = activity?.id ?? '';

  const handleNoteEdit = (updatedNote: Pick<FeedbackNoteType, 'id' | 'note'>) => {
    answerId &&
      editAnswerNote({
        appletId,
        answerId,
        activityId,
        noteId: updatedNote.id,
        note: updatedNote.note,
      });
  };

  const handleNoteDelete = (noteId: string) => {
    answerId && deleteAnswerNote({ appletId, answerId, activityId, noteId });
  };

  const addNewNote = ({ newNote }: FeedbackForm) => {
    if (!newNote.trim()) return;
    answerId && createAnswerNote({ appletId, answerId, activityId, note: newNote });
  };

  useEffect(() => {
    if (answerId && isFeedbackOpen) {
      getAnswersNotes({ appletId, answerId, activityId, params: {} });
    }
  }, [appletId, answerId, isFeedbackOpen]);

  return (
    <StyledContainer ref={containerRef}>
      <StyledForm isSticky={isFormSticky} onSubmit={handleSubmit(addNewNote)} noValidate>
        <InputController
          fullWidth
          name="newNote"
          control={control}
          label={t('addNewNote')}
          placeholder={t('addNotePlaceholder')}
          multiline
          rows={NOTE_ROWS_COUNT}
          data-testid={`${dataTestid}-add-note`}
        />
        <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', m: theme.spacing(0.8, 0, 0) }}>
          <Button variant="contained" type="submit" data-testid={`${dataTestid}-save`}>
            {t('save')}
          </Button>
        </StyledFlexTopCenter>
      </StyledForm>
      <StyledNoteListContainer>
        {isLoading ? (
          <Spinner noBackground />
        ) : (
          <Box sx={{ padding: theme.spacing(0, 2.4) }}>
            {notes.map((note, index) => (
              <FeedbackNote
                key={note.id}
                note={note}
                onEdit={handleNoteEdit}
                onDelete={handleNoteDelete}
                data-testid={`${dataTestid}-note-${index}`}
              />
            ))}
          </Box>
        )}
      </StyledNoteListContainer>
    </StyledContainer>
  );
};
