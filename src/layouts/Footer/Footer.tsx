import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import { Language } from 'components/Language';
import packageJson from '../../../package.json';

import {
  StyledFooter,
  StyledText,
  StyledLink,
  StyledUnderlineLink,
  StyledBox,
} from './Footer.styles';

const version = `v ${packageJson.version}`;
const year = new Date().getFullYear();

export const Footer = () => {
  const { t } = useTranslation('app');
  return (
    <Box>
      <StyledFooter>
        <Box>
          <StyledText>
            {version} &#169; {year}
            <StyledUnderlineLink target="_blank" href="https://childmind.org">
              Child Mind Institute
            </StyledUnderlineLink>
            &#183;
            <StyledUnderlineLink target="_blank" href="https://matter.childmind.org">
              MATTER Lab
            </StyledUnderlineLink>
          </StyledText>
        </Box>
        <StyledBox>
          <StyledLink>{t('privacy')}</StyledLink>
          <StyledLink target="_blank" href="https://mindlogger.org/terms">
            {t('terms')}
          </StyledLink>
          <StyledLink> {t('about')}</StyledLink>
          <Language />
        </StyledBox>
      </StyledFooter>
    </Box>
  );
};
