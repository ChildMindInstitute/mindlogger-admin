import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium } from 'shared/styles/styledComponents';

import {
  StyledPresentation,
  StyledDateLine,
  StyledPresentationLine,
  StyledTooltipText,
} from './TooltipComponents.styles';

export const Date = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation data-testid="tooltip-selection-presentation">
        <StyledPresentationLine>
          <Svg id="calendar" width="18" height="18" />
          <StyledDateLine>
            <StyledTooltipText>MM - DD - YY</StyledTooltipText>
          </StyledDateLine>
        </StyledPresentationLine>
      </StyledPresentation>
      <StyledBodyMedium>{t('dateHint')}.</StyledBodyMedium>
    </>
  );
};
