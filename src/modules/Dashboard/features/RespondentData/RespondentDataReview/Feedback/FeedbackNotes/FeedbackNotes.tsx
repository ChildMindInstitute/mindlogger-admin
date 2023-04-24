import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { useAsync, useHeaderSticky } from 'shared/hooks';
import {
  createAnswerNoteApi,
  deleteAnswerNoteApi,
  editAnswerNoteApi,
  getAnswersNotesApi,
} from 'api';

import { FeedbackNote } from './FeedbackNote/FeedbackNote';
import { NOTE_ROWS_COUNT } from './FeedbackNotes.const';
import { StyledContainer, StyledForm } from './FeedbackNotes.styles';
import { FeedbackNote as FeedbackNoteType } from './FeedbackNotes.types';

export const FeedbackNotes = () => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<FeedbackNoteType[]>([]);
  const { appletId, answerId } = useParams();
  const containerRef = useRef<HTMLElement | null>(null);
  const isFormSticky = useHeaderSticky(containerRef);

  const { getValues, setValue, control } = useForm({
    resolver: yupResolver(
      yup.object({
        newNote: yup.string(),
      }),
    ),
    defaultValues: { newNote: '' },
  });

  const { execute } = useAsync(
    getAnswersNotesApi,
    (res) => res?.data?.result && setNotes(res.data.result),
  );

  const updateListOfNotes = () => {
    appletId && answerId && execute({ appletId, answerId, params: {} });
  };

  const { execute: executeAddNote } = useAsync(createAnswerNoteApi, () => updateListOfNotes());

  const { execute: executeEditNote } = useAsync(editAnswerNoteApi, () => updateListOfNotes());

  const { execute: executeDeleteNote } = useAsync(deleteAnswerNoteApi, () => updateListOfNotes());

  useEffect(() => {
    if (appletId && answerId) {
      execute({ appletId, answerId, params: {} });
    }
  }, [appletId, answerId]);

  const handleNoteEdit = (updatedNote: Pick<FeedbackNoteType, 'id' | 'note'>) => {
    appletId &&
      answerId &&
      executeEditNote({ appletId, answerId, noteId: updatedNote.id, note: updatedNote.note });
  };

  const handleNoteDelete = (noteId: string) => {
    appletId && answerId && executeDeleteNote({ appletId, answerId, noteId });
  };

  const addNewNote = () => {
    appletId && answerId && executeAddNote({ appletId, answerId, note: getValues().newNote });
    setValue('newNote', '');
  };

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
