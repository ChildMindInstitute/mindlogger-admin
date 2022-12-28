import { MouseEvent } from 'react';
import { ToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

import { Svg } from 'components/Svg';
import { Tooltip, TooltipUiType } from 'components/Tooltip';

import { StyledIcon } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  toggleButtons,
  activeButton,
  setActiveButton,
}: ToggleButtonGroupProps) => {
  const handleChange = (event: MouseEvent<HTMLElement>, selected: string) => {
    setActiveButton(selected);
  };

  return (
    <MuiToggleButtonGroup fullWidth value={activeButton} exclusive onChange={handleChange}>
      {toggleButtons.map(({ value, label, tooltip }) => (
        <ToggleButton key={value} value={value}>
          {activeButton === value && (
            <StyledIcon>
              <Svg id="check" />
            </StyledIcon>
          )}
          <Tooltip uiType={TooltipUiType.secondary} tooltipTitle={tooltip}>
            <span>{label}</span>
          </Tooltip>
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
};
