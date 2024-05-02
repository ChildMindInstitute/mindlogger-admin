import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback';

import { NOTE_ROWS_COUNT } from '../FeedbackNotes.const';
import { StyledForm } from './FeedbackNotesForm.styles';
import { FeedbackNotesFormProps } from './FeedbackNotesForm.types';

export const FeedbackNotesForm = ({
  onSubmit,
  containerRef,
  isLoading,
  'data-testid': dataTestid,
}: FeedbackNotesFormProps) => {
  const { t } = useTranslation();
  const isFormSticky = useHeaderSticky(containerRef);
  const { control } = useFormContext<FeedbackForm>();

  return (
    <StyledForm isSticky={isFormSticky} onSubmit={onSubmit} noValidate>
      <InputController
        fullWidth
        name="newNote"
        control={control}
        label={t('addNewNote')}
        placeholder={t('addNotePlaceholder')}
        multiline
        rows={NOTE_ROWS_COUNT}
        disabled={isLoading}
        data-testid={`${dataTestid}-add-note`}
      />
      <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', m: theme.spacing(0.8, 0, 0) }}>
        <Button
          disabled={isLoading}
          variant="contained"
          type="submit"
          data-testid={`${dataTestid}-save`}
        >
          {t('save')}
        </Button>
      </StyledFlexTopCenter>
    </StyledForm>
  );
};
