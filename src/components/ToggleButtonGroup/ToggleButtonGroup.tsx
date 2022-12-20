import { ToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

import { Svg } from 'components/Svg';

import { StyledIcon } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  toggleButtons,
  activeButton,
  setActiveButton,
}: ToggleButtonGroupProps) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, selected: string) => {
    setActiveButton(selected);
  };

  return (
    <MuiToggleButtonGroup fullWidth value={activeButton} exclusive onChange={handleChange}>
      {toggleButtons.map(({ value, label }) => (
        <ToggleButton key={value} value={value}>
          {activeButton === value && (
            <StyledIcon>
              <Svg id="check" width={24} height={24} />
            </StyledIcon>
          )}
          {label}
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
};
