import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
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
  theme,
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

  const userName = `${note.user.firstName ?? ''} ${note.user.lastName ?? ''}`;

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(
      yup.object({
        noteText: yup.string().trim().required(),
      }),
    ),
    defaultValues: { noteText: note.note || '' },
  });

  const saveChanges = ({ noteText }: { noteText: string }) => {
    onEdit({
      id: note.id,
      note: noteText,
    });
    setIsEditMode(false);
  };

  const commonSvgProps = {
    width: '15',
    height: '15',
  };

  return (
    <>
      <StyledNoteHeader
        onMouseEnter={() => !isEditMode && setIsVisibleActions(true)}
        onMouseLeave={() => setIsVisibleActions(false)}
      >
        <StyledFlexTopStart>
          <StyledAuthorLabel color={variables.palette.outline}>{userName}</StyledAuthorLabel>
          <StyledBodyMedium color={variables.palette.outline}>
            {timeAgo.format(getDateInUserTimezone(note.createdAt))}
          </StyledBodyMedium>
        </StyledFlexTopStart>
        {!isEditMode && isVisibleActions && (
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
      {isEditMode ? (
        <StyledForm onSubmit={handleSubmit(saveChanges)} noValidate>
          <InputController
            required
            fullWidth
            name="noteText"
            control={control}
            multiline
            rows={NOTE_ROWS_COUNT}
          />
          <StyledFlexTopCenter sx={{ justifyContent: 'end', m: theme.spacing(0.8, 0) }}>
            <Button onClick={() => setIsEditMode(false)}>{t('cancel')}</Button>
            <Button type="submit" variant="contained" sx={{ ml: theme.spacing(0.8) }}>
              {t('save')}
            </Button>
          </StyledFlexTopCenter>
        </StyledForm>
      ) : (
        <StyledNote>
          <StyledBodyLarge>{note.note}</StyledBodyLarge>
        </StyledNote>
      )}
    </>
  );
};
