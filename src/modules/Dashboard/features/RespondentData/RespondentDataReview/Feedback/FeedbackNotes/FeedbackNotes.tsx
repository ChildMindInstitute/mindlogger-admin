import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button } from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';

import { FeedbackNote } from './FeedbackNote/FeedbackNote';
import { FeedbackNote as FeedbackNoteType } from './FeedbackNotes.types';
import { mockedNotes, mockUpdate } from './mock';
import { NOTE_ROWS_COUNT } from './FeedbackNotes.const';
import { StyledContainer, StyledForm } from './FeedbackNotes.styles';

export const FeedbackNotes = () => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState(mockedNotes);
  const containerRef = useRef<HTMLElement | null>(null);
  const isFormSticky = useHeaderSticky(containerRef);
  const author = 'John'; // TODO: replace with real data

  const { getValues, setValue, control } = useForm({
    resolver: yupResolver(
      yup.object({
        newNote: yup.string(),
      }),
    ),
    defaultValues: { newNote: '' },
  });

  const handleNoteEdit = (updatedNote: FeedbackNoteType) => {
    const updatedNotes = mockUpdate(notes, updatedNote);
    setNotes(updatedNotes);
  };

  const handleNoteDelete = (note: FeedbackNoteType) => {
    const updatedNotes = mockUpdate(notes, note, true);
    setNotes(updatedNotes);
  };

  const addNewNote = () => {
    setNotes([
      ...notes,
      {
        id: uniqueId(),
        author,
        date: new Date(),
        content: getValues().newNote,
      },
    ]);
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
            {t('apply')}
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
