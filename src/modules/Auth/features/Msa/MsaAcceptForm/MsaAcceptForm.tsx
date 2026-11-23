import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, FormControlLabel, Link } from '@mui/material';

import {
  StyledDialogActions,
  StyledDialogHeader,
  StyledDialogTitle,
} from 'shared/components/Modal/Modal.styles';
import { StyledBodyLarge, StyledErrorText, StyledFlexTopCenter } from 'shared/styles';

import { MSA_URL } from './MsaAcceptForm.const';
import { StyledMsaBody } from './MsaAcceptForm.styles';
import { MsaAcceptFormProps } from './MsaAcceptForm.types';

export const MsaLink = () => {
  const { t } = useTranslation('app');

  return (
    <StyledBodyLarge>
      <Link href={MSA_URL} target="_blank" rel="noreferrer" underline="always">
        {t('msaReadLink')}
      </Link>
    </StyledBodyLarge>
  );
};

// Content of the MSA dialogue: title, copy, checkbox and actions
export const MsaAcceptForm = ({
  title,
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
      <StyledDialogHeader>
        <StyledDialogTitle data-testid={`${dataTestid}-title`}>{title}</StyledDialogTitle>
      </StyledDialogHeader>
      <StyledMsaBody>
        {children}
        {error && (
          <StyledErrorText marginTop={0} marginBottom={0} data-testid={`${dataTestid}-error`}>
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
      </StyledMsaBody>
      <StyledDialogActions actionsAlign="end">
        <StyledFlexTopCenter sx={{ gap: 1.6 }}>
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
        </StyledFlexTopCenter>
      </StyledDialogActions>
    </>
  );
};
