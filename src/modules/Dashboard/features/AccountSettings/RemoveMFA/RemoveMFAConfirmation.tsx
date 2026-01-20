import React from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';

import {
  StyledDialog,
  StyledHeader,
  StyledTitle,
  StyledCloseButton,
  StyledContent,
  StyledDescription,
  StyledButtonContainer,
  StyledButton,
} from './RemoveMFAConfirmation.styles';
import { RemoveMFAConfirmationProps } from './RemoveMFAConfirmation.types';

export const RemoveMFAConfirmation: React.FC<RemoveMFAConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation('app');

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth={false}>
      <StyledHeader>
        <StyledTitle>{t('mfa.remove.title')}</StyledTitle>
        <StyledCloseButton onClick={onClose} disabled={isLoading} type="button">
          <Svg id="close" width={24} height={24} />
        </StyledCloseButton>
      </StyledHeader>

      <StyledContent>
        <StyledDescription>{t('mfa.remove.confirmationMessage')}</StyledDescription>

        <StyledButtonContainer>
          <StyledButton className="primary" onClick={onConfirm} disabled={isLoading} type="button">
            {isLoading ? t('mfa.buttons.removing') : t('mfa.buttons.remove')}
          </StyledButton>

          <StyledButton className="secondary" onClick={onClose} disabled={isLoading} type="button">
            {t('mfa.buttons.cancel')}
          </StyledButton>
        </StyledButtonContainer>
      </StyledContent>
    </StyledDialog>
  );
};
