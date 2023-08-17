import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Svg } from 'shared/components';
import { useTimeAgo } from 'shared/hooks';
import { getDateInUserTimezone } from 'shared/utils';
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
import { NOTE_ROWS_COUNT } from '../FeedbackNotes.const';

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
    defaultValues: { noteText: note.note || '' },
  });

  const saveChanges = () => {
    onEdit({
      id: note.id,
      note: getValues().noteText,
    });
    setIsEditMode(false);
  };

  const commonSvgProps = {
    width: '15',
    height: '15',
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
            rows={NOTE_ROWS_COUNT}
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
              <StyledAuthorLabel color={variables.palette.outline}>
                {note.user.firstName}
              </StyledAuthorLabel>
              <StyledBodyMedium color={variables.palette.outline}>
                {timeAgo.format(getDateInUserTimezone(note.createdAt))}
              </StyledBodyMedium>
            </StyledFlexTopStart>
            {isVisibleActions && (
              <StyledActions>
                <StyledButton onClick={() => setIsEditMode(true)}>
                  <Svg id="edit" {...commonSvgProps} />
                </StyledButton>
                <StyledButton onClick={() => onDelete(note.id)}>
                  <Svg id="trash" {...commonSvgProps} />
                </StyledButton>
              </StyledActions>
            )}
          </StyledNoteHeader>
          <Box>
            <StyledBodyLarge>{note.note}</StyledBodyLarge>
          </Box>
        </StyledNote>
      )}
    </>
  );
};
