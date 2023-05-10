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
    <StyledConfirmation>
      <StyledHeader>{t('checkYourEmail')}</StyledHeader>
      <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }}>
        {t('weHaveSentPasswordResetLink', { email })}
      </StyledBodyMedium>

      <StyledBodyMedium sx={{ mb: theme.spacing(2.4), color: variables.palette.outline }}>
        <Trans
          i18nKey="ifYouDontReceiveEmail"
          components={[
            <a className="here" href="#">
              here
            </a>,
          ]}
        />
      </StyledBodyMedium>

      <Button variant="contained" type="button" onClick={() => navigate(page.login)}>
        {t('backToLogin')}
      </Button>
    </StyledConfirmation>
  );
};
