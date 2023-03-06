import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import theme from 'styles/theme';
import { StyledBodyMedium, StyledLabelLarge } from 'styles/styledComponents';

import {
  StyledPresentation,
  StyledTooltipText,
  StyledNumberSelection,
  StyledNumberSelectionLine,
} from './TooltipComponents.styles';

export const NumberSelection = () => {
  const { t } = useTranslation();

  return (
    <>
      <StyledPresentation>
        <StyledNumberSelection>
          <StyledNumberSelectionLine>
            <StyledLabelLarge sx={{ mr: theme.spacing(0.5), textAlign: 'center' }}>
              {t('dropdown')}
            </StyledLabelLarge>
            <Svg id="navigate-down" width="22" height="22" />
          </StyledNumberSelectionLine>
          <StyledNumberSelectionLine>
            <StyledTooltipText>0</StyledTooltipText>
          </StyledNumberSelectionLine>
          <StyledNumberSelectionLine>
            <StyledTooltipText>1</StyledTooltipText>
          </StyledNumberSelectionLine>
        </StyledNumberSelection>
      </StyledPresentation>
      <StyledBodyMedium>{t('createDropdownNumeric')}</StyledBodyMedium>
    </>
  );
};
