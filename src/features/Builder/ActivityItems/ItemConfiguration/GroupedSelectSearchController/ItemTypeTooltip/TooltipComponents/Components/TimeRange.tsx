import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import theme from 'styles/theme';
import { StyledBodyMedium, StyledFlexTopCenter } from 'styles/styledComponents';

import {
  StyledPresentation,
  StyledTooltipText,
  StyledDateLine,
  StyledPresentationLine,
} from '../TooltipComponents.styles';

export const TimeRange = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation>
        <StyledPresentationLine>
          <Svg id="clock" width="18" height="18" />
          <StyledDateLine>
            <StyledTooltipText>HH:MM</StyledTooltipText>
          </StyledDateLine>
          <StyledFlexTopCenter sx={{ m: theme.spacing(0, 1) }}>-</StyledFlexTopCenter>
          <Svg id="clock" width="18" height="18" />
          <StyledDateLine>
            <StyledTooltipText>HH:MM</StyledTooltipText>
          </StyledDateLine>
        </StyledPresentationLine>
      </StyledPresentation>
      <StyledBodyMedium>{t('promptSelectTimeRange')}</StyledBodyMedium>
    </>
  );
};
