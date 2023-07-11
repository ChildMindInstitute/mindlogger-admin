import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import {
  DatavizActivity,
  createAnswerNoteApi,
  deleteAnswerNoteApi,
  editAnswerNoteApi,
  getAnswersNotesApi,
} from 'api';

import { FeedbackNote } from './FeedbackNote/FeedbackNote';
import { NOTE_ROWS_COUNT } from './FeedbackNotes.const';
import { StyledContainer, StyledForm } from './FeedbackNotes.styles';
import { FeedbackNote as FeedbackNoteType } from './FeedbackNotes.types';

export const FeedbackNotes = ({ activity }: { activity: DatavizActivity }) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<FeedbackNoteType[]>([]);
  const { appletId, answerId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isFormSticky = useHeaderSticky(containerRef);

  const methods = useFormContext();
  const { control, getValues, setValue } = methods;

  const { execute: getAnswersNotes } = useAsync(
    getAnswersNotesApi,
    (res) => res?.data?.result && setNotes(res.data.result),
  );

  const updateListOfNotes = () => {
    if (!appletId || !answerId) return;
    getAnswersNotes({ appletId, answerId, activityId, params: {} });
  };

  const { execute: createAnswerNote } = useAsync(createAnswerNoteApi, () => updateListOfNotes());
  const { execute: editAnswerNote } = useAsync(editAnswerNoteApi, () => updateListOfNotes());
  const { execute: deleteAnswerNote } = useAsync(deleteAnswerNoteApi, () => updateListOfNotes());

  const activityId = activity?.id ?? '';

  const handleNoteEdit = (updatedNote: Pick<FeedbackNoteType, 'id' | 'note'>) => {
    appletId &&
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
    appletId && answerId && deleteAnswerNote({ appletId, answerId, activityId, noteId });
  };

  const addNewNote = () => {
    appletId &&
      answerId &&
      createAnswerNote({ appletId, answerId, activityId, note: getValues('newNote') });
    setValue('newNote', '');
  };

  useEffect(() => {
    if (appletId && answerId) {
      getAnswersNotes({ appletId, answerId, activityId, params: {} });
    }
  }, [appletId, answerId]);

  return (
    <StyledContainer ref={containerRef}>
      <StyledForm isSticky={isFormSticky}>
        <InputController
          fullWidth
          name="newNote"
          control={control}
          label={t('addNewNote')}
          placeholder={t('addNotePlaceholder')}
          multiline
          rows={NOTE_ROWS_COUNT}
        />
        <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', m: theme.spacing(0.8, 0, 0) }}>
          <Button variant="contained" onClick={addNewNote}>
            {t('save')}
          </Button>
        </StyledFlexTopCenter>
      </StyledForm>
      <Box sx={{ padding: theme.spacing(2.4) }}>
        {notes.map((note) => (
          <FeedbackNote
            key={note.id}
            note={note}
            onEdit={handleNoteEdit}
            onDelete={handleNoteDelete}
          />
        ))}
      </Box>
    </StyledContainer>
  );
};
