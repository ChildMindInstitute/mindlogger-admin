import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Svg } from 'shared/components';
import { useTimeAgo } from 'shared/hooks';
import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  variables,
} from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';

import {
  StyledActions,
  StyledAuthorLabel,
  StyledButton,
  StyledForm,
  StyledNote,
  StyledNoteHeader,
} from './FeedbackNote.styles';
import { FeedbackNoteProps } from './FeedbackNote.types';

export const FeedbackNote = ({ note, onEdit, onDelete }: FeedbackNoteProps) => {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo();
  const [isVisibleActions, setIsVisibleActions] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { getValues, control } = useForm({
    resolver: yupResolver(
      yup.object({
        noteText: yup.string(),
      }),
    ),
    defaultValues: { noteText: note.content || '' },
  });

  const saveChanges = () => {
    onEdit({
      ...note,
      date: new Date(),
      content: getValues().noteText,
    });
    setIsEditMode(false);
  };

  return (
    <>
      {isEditMode ? (
        <StyledForm noValidate>
          <InputController
            required
            fullWidth
            name="noteText"
            control={control}
            multiline
            rows={3}
          />
          <StyledFlexTopCenter sx={{ justifyContent: 'end', mt: 0.8 }}>
            <Button onClick={() => setIsEditMode(false)}>{t('cancel')}</Button>
            <Button variant="contained" sx={{ ml: 0.8 }} onClick={saveChanges}>
              {t('apply')}
            </Button>
          </StyledFlexTopCenter>
        </StyledForm>
      ) : (
        <StyledNote>
          <StyledNoteHeader
            onMouseEnter={() => setIsVisibleActions(true)}
            onMouseLeave={() => setIsVisibleActions(false)}
          >
            <StyledFlexTopStart>
              <StyledAuthorLabel color={variables.palette.outline}>{note.author}</StyledAuthorLabel>
              <StyledBodyMedium color={variables.palette.outline}>
                {timeAgo.format(note.date)}
              </StyledBodyMedium>
            </StyledFlexTopStart>
            {isVisibleActions && (
              <StyledActions>
                <StyledButton onClick={() => setIsEditMode(true)}>
                  <Svg width="15" height="15" id="edit" />
                </StyledButton>
                <StyledButton onClick={() => onDelete(note)}>
                  <Svg width="15" height="15" id="trash" />
                </StyledButton>
              </StyledActions>
            )}
          </StyledNoteHeader>
          <Box>
            <StyledBodyLarge>{note.content}</StyledBodyLarge>
          </Box>
        </StyledNote>
      )}
    </>
  );
};
