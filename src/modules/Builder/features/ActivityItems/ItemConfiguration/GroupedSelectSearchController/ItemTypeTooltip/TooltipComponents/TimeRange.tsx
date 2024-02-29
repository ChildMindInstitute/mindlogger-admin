import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import theme from 'shared/styles/theme';
import { StyledBodyMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';

import {
  StyledPresentation,
  StyledTooltipText,
  StyledDateLine,
  StyledPresentationLine,
} from './TooltipComponents.styles';
import { tooltipPresentationDataTestid } from '../ItemTypeTooltip.const';

const timeRangeIcon = <Svg id="clock" width="18" height="18" />;

export const TimeRange = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid={tooltipPresentationDataTestid}>
        <StyledPresentationLine>
          {timeRangeIcon}
          <StyledDateLine>
            <StyledTooltipText>HH:MM</StyledTooltipText>
          </StyledDateLine>
          <StyledFlexTopCenter sx={{ m: theme.spacing(0, 1) }}>-</StyledFlexTopCenter>
          {timeRangeIcon}
          <StyledDateLine>
            <StyledTooltipText>HH:MM</StyledTooltipText>
          </StyledDateLine>
        </StyledPresentationLine>
      </StyledPresentation>
      <StyledBodyMedium>{t('timeRangeHint')}.</StyledBodyMedium>
    </>
  );
};
