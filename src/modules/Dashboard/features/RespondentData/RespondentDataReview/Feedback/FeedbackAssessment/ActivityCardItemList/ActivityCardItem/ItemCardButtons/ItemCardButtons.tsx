import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';
import { hasAnswerValue } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/FeedbackAssessment/FeedbackAssessment.utils';

import { ItemCardButtonsProps } from './ItemCardButtons.types';

export const ItemCardButtons = ({
  step,
  config,
  isSubmitVisible,
  onBackButtonClick,
  onNextButtonClick,
  onSubmit,
  'data-testid': dataTestid,
}: ItemCardButtonsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const answerValue = watch(`assessmentItems.${step}.answers`);

  const [hasAnswer, hasSetAnswer] = useState(hasAnswerValue(answerValue));

  useEffect(() => {
    hasSetAnswer(hasAnswerValue(answerValue));
  }, [answerValue]);

  return (
    <StyledFlexTopCenter
      sx={{ justifyContent: 'flex-end', mt: theme.spacing(1.6) }}
      data-testid={dataTestid}
    >
      {config.isBackVisible && (
        <Button
          sx={{ minWidth: '10rem' }}
          onClick={onBackButtonClick}
          data-testid={`${dataTestid}-back`}
        >
          {t('back')}
        </Button>
      )}
      <Button
        sx={{ minWidth: '10rem', ml: theme.spacing(1.6) }}
        variant="contained"
        disabled={!config.isSkippable && !hasAnswer}
        onClick={isSubmitVisible ? onSubmit : onNextButtonClick}
        data-testid={`${dataTestid}-${isSubmitVisible ? 'submit' : 'next'}`}
      >
        {isSubmitVisible ? t('submit') : t('next')}
      </Button>
    </StyledFlexTopCenter>
  );
};
