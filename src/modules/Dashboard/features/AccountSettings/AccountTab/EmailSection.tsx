import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { auth } from 'redux/modules';

import {
  StyledSection,
  StyledEmailSection,
  StyledEmailLabel,
  StyledEmailText,
} from './AccountTab.styles';

export const EmailSection = () => {
  const { t } = useTranslation('app');
  const authData = auth.useData();

  return (
    <StyledSection>
      <StyledEmailSection>
        <Box>
          <StyledEmailLabel>{t('mfa.email')}</StyledEmailLabel>
          <StyledEmailText>{authData?.user?.email}</StyledEmailText>
        </Box>
      </StyledEmailSection>
    </StyledSection>
  );
};
