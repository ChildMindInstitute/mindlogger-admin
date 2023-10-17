import { useState } from 'react';
import { Collapse } from '@mui/material';
import { Trans } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import {
  StyledIconButton,
  StyledTitleBoldMedium,
  StyledTitleMedium,
} from 'shared/styles/styledComponents';

import { StyledAlert, StyledAlertContent, StyledLink } from './Banner.styles';
import { BANNER_LINK } from './Banner.const';

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Collapse sx={{ minHeight: 'unset !important' }} in={isVisible}>
      <StyledAlert severity="warning" icon={false}>
        <StyledAlertContent>
          <Svg id="exclamation-circle" width="26.7" height="26.7" />
          <Trans i18nKey="bannerText">
            <StyledTitleBoldMedium>
              You are using the new version of MindLogger!
            </StyledTitleBoldMedium>
            <StyledTitleMedium>End users must update to the new app.</StyledTitleMedium>
            <StyledLink target="_blank" href={BANNER_LINK}>
              Take these steps now to ensure participant response data is not lost.
            </StyledLink>
          </Trans>
        </StyledAlertContent>
        <StyledIconButton className="close-btn" onClick={() => setIsVisible(false)}>
          <Svg id="close" />
        </StyledIconButton>
      </StyledAlert>
    </Collapse>
  );
};
