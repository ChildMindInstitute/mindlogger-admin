import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

import { page } from 'resources';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { StyledConfirmation, StyledHeader } from './Confirmation.styles';

export const Confirmation = ({ email }: { email: string }) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  return (
    <StyledConfirmation data-testid="confirmation">
      <StyledHeader>{t('checkYourEmail')}</StyledHeader>
      <StyledBodyMedium
        data-testid="confirmation-description"
        sx={{ mb: theme.spacing(2.4), color: variables.palette.on_surface_variant }}>
        <Trans i18nKey="passwordResetLink">
          A password reset link is sent to {{ email }} <br /> if that email is associated with a MindLogger account.
        </Trans>
      </StyledBodyMedium>
      <StyledBodyMedium sx={{ mb: theme.spacing(2.4), color: variables.palette.outline }}>
        {t('ifYouDontReceiveEmail')}
      </StyledBodyMedium>
      <Button data-testid="confirmation-button" variant="contained" type="button" onClick={() => navigate(page.login)}>
        {t('backToLogin')}
      </Button>
    </StyledConfirmation>
  );
};
