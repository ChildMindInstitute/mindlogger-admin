import get from 'lodash.get';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { Svg, Actions } from 'shared/components';
import { theme, StyledClearedButton, StyledFlexColumn, StyledLabelBoldLarge, StyledLabelLarge } from 'shared/styles';

import { HeaderProps } from './Header.types';
import { StyledImg, StyledSliderPanelHeader, StyledSliderPanelPreviewContainer } from './Header.styles';
import { getActions } from './Header.utils';
import { StyledSlider } from '../SliderPanel.styles';
import { getMarks } from '../SliderPanel.utils';
import { ItemConfigurationSettings } from '../../../../ItemConfiguration.types';

const commonButtonStyles = {
  p: theme.spacing(1),
  mr: theme.spacing(0.2),
};

export const Header = ({ name, index, label, isExpanded, isMultiple, onArrowClick, onTrashClick }: HeaderProps) => {
  const { watch } = useCustomFormContext();

  const settings = watch(`${name}.config`);
  const { minValue, maxValue, minLabel, maxLabel, minImage, maxImage } =
    watch(`${name}.responseValues${isMultiple ? `.rows.${index}` : ''}`) || {};
  const isActionsVisible = isMultiple && index !== 0;

  const dataTestid = 'builder-activity-items-item-configuration-slider';

  const commonActionsProps = {
    items: getActions({ onRemove: () => onTrashClick?.(), 'data-testid': dataTestid }),
    context: name,
    sxProps: { width: 'unset', minWidth: '4.8rem', justifyContent: 'flex-end' },
    visibleByDefault: isExpanded,
  };

  if (isExpanded) {
    return (
      <StyledSliderPanelHeader isExpanded>
        <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles} data-testid={`${dataTestid}-collapse`}>
          <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledLabelBoldLarge data-testid={`${dataTestid}-title`}>{label}</StyledLabelBoldLarge>
        {isActionsVisible && <Actions {...commonActionsProps} />}
      </StyledSliderPanelHeader>
    );
  }

  const hasTickMarks = get(settings, ItemConfigurationSettings.HasTickMarks);
  const hasTickMarksLabels = get(settings, ItemConfigurationSettings.HasTickMarksLabels);

  const marks = hasTickMarks && getMarks(minValue, maxValue, hasTickMarksLabels);

  return (
    <StyledSliderPanelHeader>
      <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles} data-testid={`${dataTestid}-collapse`}>
        <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
      </StyledClearedButton>
      <StyledLabelBoldLarge>{label}</StyledLabelBoldLarge>
      <StyledSliderPanelPreviewContainer>
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{minLabel}</StyledLabelLarge>}
          {minImage && <StyledImg src={minImage} />}
        </StyledFlexColumn>
        <StyledSlider min={minValue} max={maxValue} marks={marks} disabled />
        <StyledFlexColumn sx={{ alignItems: 'center' }}>
          {<StyledLabelLarge>{maxLabel}</StyledLabelLarge>}
          {maxImage && <StyledImg src={maxImage} />}
        </StyledFlexColumn>
        {isActionsVisible && <Actions {...commonActionsProps} />}
      </StyledSliderPanelPreviewContainer>
    </StyledSliderPanelHeader>
  );
};
