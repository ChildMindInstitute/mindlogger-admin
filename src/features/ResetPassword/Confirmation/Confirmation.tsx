import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';

import { page } from 'resources';

import {
  StyledConfirmation,
  StyledHeader,
  StyledSubheader,
  StyledInfo,
  StyledLink,
} from './Confirmation.styles';

export const Confirmation = ({ email }: { email: string }) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  return (
    <StyledConfirmation>
      <StyledHeader>{t('checkYourEmail')}</StyledHeader>
      <StyledSubheader>
        {t('weHaveSentPasswordResetLink')}
        <br />
        {email}
      </StyledSubheader>
      <StyledInfo>
        {/*TODO: Add link with information about restoring password*/}
        {t('ifYouDontReceiveEmail')}
        <StyledLink href="#">{t('here')}</StyledLink>
        {t('forMoreOptions')}
      </StyledInfo>
      <Button variant="contained" type="button" onClick={() => navigate(page.login)}>
        {t('backToLogin')}
      </Button>
    </StyledConfirmation>
  );
};
