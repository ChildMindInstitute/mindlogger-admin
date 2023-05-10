import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import packageJson from '../../../../package.json';
import { Language } from './Language';
import {
  StyledFooter,
  StyledText,
  StyledLink,
  StyledUnderlineLink,
  StyledBox,
} from './Footer.styles';
import { ABOUT_LINK, CMI_LINK, MATTER_LAB_LINK, PRIVACY_LINK, TERMS_LINK } from './Footer.const';

const version = `v ${packageJson.version}`;
const year = new Date().getFullYear();

export const Footer = () => {
  const { t } = useTranslation('app');

  const { REACT_APP_DEVELOP_BUILD_VERSION } = process.env;
  const buildVersion = REACT_APP_DEVELOP_BUILD_VERSION && `(${REACT_APP_DEVELOP_BUILD_VERSION})`;

  return (
    <StyledFooter>
      <Box>
        <StyledText>
          MindLogger {version} {buildVersion} &#169; {year}
          <StyledUnderlineLink target="_blank" href={CMI_LINK}>
            Child Mind Institute
          </StyledUnderlineLink>
          &#183;
          <StyledUnderlineLink target="_blank" href={MATTER_LAB_LINK}>
            MATTER Lab
          </StyledUnderlineLink>
        </StyledText>
      </Box>
      <StyledBox>
        <StyledLink target="_blank" href={PRIVACY_LINK}>
          {t('privacy')}
        </StyledLink>
        <StyledLink target="_blank" href={TERMS_LINK}>
          {t('terms')}
        </StyledLink>
        <StyledLink target="_blank" href={ABOUT_LINK}>
          {t('about')}
        </StyledLink>
        <Language />
      </StyledBox>
    </StyledFooter>
  );
};
