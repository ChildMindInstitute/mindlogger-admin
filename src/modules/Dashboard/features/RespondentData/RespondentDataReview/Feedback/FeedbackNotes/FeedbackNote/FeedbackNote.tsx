import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
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
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';

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

export const FeedbackNote = ({
  note,
  onEdit,
  onDelete,
  'data-testid': dataTestid,
}: FeedbackNoteProps) => {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo();
  const [isVisibleActions, setIsVisibleActions] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { isFeedbackOpen } = useContext(RespondentDataReviewContext);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: { noteText: note.note || '' },
  });

  const userName = `${note.user.firstName ?? ''} ${note.user.lastName ?? ''}`;

  const commonSvgProps = {
    width: '15',
    height: '15',
  };

  const saveChanges = ({ noteText }: { noteText: string }) => {
    if (!noteText.trim()) return;
    onEdit({
      id: note.id,
      note: noteText,
    });
    setIsEditMode(false);
  };

  const handleNoteEdit = () => {
    setValue('noteText', note.note);
    setIsEditMode(true);
  };

  useEffect(() => {
    if (!isFeedbackOpen && isEditMode) {
      setValue('noteText', note.note);
      setIsEditMode(false);
    }
  }, [isFeedbackOpen]);

  return (
    <Box data-testid={`${dataTestid}`}>
      <StyledNoteHeader
        onMouseEnter={() => !isEditMode && setIsVisibleActions(true)}
        onMouseLeave={() => setIsVisibleActions(false)}
        data-testid={`${dataTestid}-header`}
      >
        <StyledFlexTopStart>
          <StyledAuthorLabel color={variables.palette.outline}>{userName}</StyledAuthorLabel>
          <StyledBodyMedium color={variables.palette.outline}>
            {timeAgo.format(getDateInUserTimezone(note.createdAt))}
          </StyledBodyMedium>
        </StyledFlexTopStart>
        {!isEditMode && isVisibleActions && (
          <StyledActions>
            <StyledButton onClick={handleNoteEdit} data-testid={`${dataTestid}-edit`}>
              <Svg id="edit" {...commonSvgProps} />
            </StyledButton>
            <StyledButton onClick={() => onDelete(note.id)} data-testid={`${dataTestid}-remove`}>
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
            data-testid={`${dataTestid}-text`}
          />
          <StyledFlexTopCenter sx={{ justifyContent: 'end', m: theme.spacing(0.8, 0) }}>
            <Button onClick={() => setIsEditMode(false)} data-testid={`${dataTestid}-cancel`}>
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: theme.spacing(0.8) }}
              data-testid={`${dataTestid}-save`}
            >
              {t('save')}
            </Button>
          </StyledFlexTopCenter>
        </StyledForm>
      ) : (
        <StyledNote data-testid={`${dataTestid}-note`}>
          <StyledBodyLarge>{note.note}</StyledBodyLarge>
        </StyledNote>
      )}
    </Box>
  );
};
