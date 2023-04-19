import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { StyledFlexTopCenter, theme } from 'shared/styles';

import { ItemCardButtonsProps } from './ItemCardButtons.types';

export const ItemCardButtons = ({
  step,
  config,
  isSubmitVisible,
  onBackButtonClick,
  onNextButtonClick,
  onSubmit,
}: ItemCardButtonsProps) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();

  const getValue = (value: string | number | string[]) =>
    !!(Array.isArray(value) ? value.length : value);

  const answerValue = watch(`answers.${step}.answer.value`);

  const [isNextDisable, setIsNextDisable] = useState(getValue(answerValue));

  useEffect(() => {
    setIsNextDisable(!getValue(answerValue));
  }, [answerValue]);

  return (
    <StyledFlexTopCenter sx={{ justifyContent: 'flex-end', mt: theme.spacing(1.6) }}>
      {config.isBackVisible && (
        <Button sx={{ minWidth: '10rem' }} onClick={onBackButtonClick}>
          {t('back')}
        </Button>
      )}
      <Button
        sx={{ minWidth: '10rem', ml: theme.spacing(1.6) }}
        variant="contained"
        disabled={!config.isSkippable && isNextDisable}
        onClick={isSubmitVisible ? onSubmit : onNextButtonClick}
      >
        {isSubmitVisible ? t('submit') : t('next')}
      </Button>
    </StyledFlexTopCenter>
  );
};
