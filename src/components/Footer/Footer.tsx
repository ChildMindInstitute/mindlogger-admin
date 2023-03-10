import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Language } from 'components';
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

  const { NODE_ENV, REACT_APP_DEVELOP_BUILD_VERSION: buildVer } = process.env;

  return (
    <StyledFooter>
      <Box>
        <StyledText>
          {version} {NODE_ENV !== 'production' && buildVer && `(${buildVer})`} &#169; {year}
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
        <StyledLink target="_blank" href="https://mindlogger.org/privacy">
          {t('privacy')}
        </StyledLink>
        <StyledLink target="_blank" href="https://mindlogger.org/terms">
          {t('terms')}
        </StyledLink>
        <StyledLink target="_blank" href="https://mindlogger.org/about">
          {t('about')}
        </StyledLink>
        <Language />
      </StyledBox>
    </StyledFooter>
  );
};
