import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, FormControlLabel } from '@mui/material';

import { StyledBodyLarge, StyledErrorText } from 'shared/styles';

import { MSA_URL } from './MsaAcceptForm.const';
import { StyledActions, StyledMsaLink } from './MsaAcceptForm.styles';
import { MsaAcceptFormProps } from './MsaAcceptForm.types';

export const MsaLink = () => {
  const { t } = useTranslation('app');

  return (
    <StyledMsaLink href={MSA_URL} target="_blank" rel="noreferrer">
      {t('msaReadLink')}
    </StyledMsaLink>
  );
};

export const MsaAcceptForm = ({
  children,
  secondaryButtonText,
  onSecondaryClick,
  onAccept,
  isSaving = false,
  error,
  'data-testid': dataTestid = 'msa-accept-form',
}: MsaAcceptFormProps) => {
  const { t } = useTranslation('app');
  const [isAgreed, setIsAgreed] = useState(false);

  const getAcceptText = () => {
    if (isSaving) return t('msaSaving');
    if (error) return t('tryAgain');

    return t('msaAcceptAndContinue');
  };

  return (
    <>
      {children}
      {error && (
        <StyledErrorText marginTop={0} data-testid={`${dataTestid}-error`}>
          {error}
        </StyledErrorText>
      )}
      <FormControlLabel
        disabled={isSaving}
        control={
          <Checkbox
            checked={isAgreed}
            onChange={(event) => setIsAgreed(event.target.checked)}
            data-testid={`${dataTestid}-checkbox`}
          />
        }
        label={<StyledBodyLarge>{t('msaAgreeLabel')}</StyledBodyLarge>}
      />
      <StyledActions>
        <Button
          variant="text"
          disabled={isSaving}
          onClick={onSecondaryClick}
          data-testid={`${dataTestid}-secondary`}
        >
          {secondaryButtonText}
        </Button>
        <Button
          variant="contained"
          disabled={!isAgreed || isSaving}
          onClick={onAccept}
          data-testid={`${dataTestid}-accept`}
        >
          {getAcceptText()}
        </Button>
      </StyledActions>
    </>
  );
};
