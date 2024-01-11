import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Language } from './Language';
import {
  StyledFooter,
  StyledText,
  StyledLink,
  StyledUnderlineLink,
  StyledBox,
} from './Footer.styles';
import {
  ABOUT_LINK,
  CMI_LINK,
  CREDITS_LINK,
  PRIVACY_LINK,
  SUPPORT_LINK,
  TERMS_LINK,
} from './Footer.const';

const year = new Date().getFullYear();

export const Footer = () => {
  const { t } = useTranslation('app');

  const { REACT_APP_DEVELOP_BUILD_VERSION } = process.env;

  return (
    <StyledFooter>
      <Box>
        <StyledText>
          {t('footerText')}
          <StyledUnderlineLink target="_blank" href={CMI_LINK}>
            Child Mind Institute
          </StyledUnderlineLink>
          &#169; {year} {REACT_APP_DEVELOP_BUILD_VERSION ?? ''}
        </StyledText>
      </Box>
      <StyledBox>
        <StyledLink target="_blank" href={ABOUT_LINK}>
          {t('about')}
        </StyledLink>
        <StyledLink target="_blank" href={PRIVACY_LINK}>
          {t('privacy')}
        </StyledLink>
        <StyledLink target="_blank" href={TERMS_LINK}>
          {t('terms')}
        </StyledLink>
        <StyledLink target="_blank" href={CREDITS_LINK}>
          {t('credits')}
        </StyledLink>
        <StyledLink target="_blank" href={SUPPORT_LINK}>
          {t('support')}
        </StyledLink>
        <Language />
      </StyledBox>
    </StyledFooter>
  );
};
