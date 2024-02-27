import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium } from 'shared/styles/styledComponents';

import {
  StyledPresentation,
  StyledTooltipText,
  StyledDateLine,
  StyledPresentationLine,
} from './TooltipComponents.styles';

const timeIcon = <Svg id="clock" width="18" height="18" />;

export const Time = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid="tooltip-selection-presentation">
        <StyledPresentationLine>
          {timeIcon}
          <StyledDateLine>
            <StyledTooltipText>HH:MM</StyledTooltipText>
          </StyledDateLine>
        </StyledPresentationLine>
      </StyledPresentation>
      <StyledBodyMedium>{t('timeHint')}.</StyledBodyMedium>
    </>
  );
};
