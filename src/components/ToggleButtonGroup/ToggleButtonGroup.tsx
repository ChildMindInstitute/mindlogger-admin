import { useTranslation } from 'react-i18next';
import { ToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

import { Svg } from 'components/Svg';

import { StyledIcon } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  toggleButtons,
  activeButton,
  setActiveButton,
  customChange,
}: ToggleButtonGroupProps) => {
  const { t } = useTranslation('app');

  const handleChange = (event: React.MouseEvent<HTMLElement>, selected: string) => {
    customChange && customChange(selected);
    setActiveButton(selected);
  };

  return (
    <MuiToggleButtonGroup fullWidth value={activeButton} exclusive onChange={handleChange}>
      {toggleButtons.map(({ value, label }) => (
        <ToggleButton key={value} value={value}>
          {activeButton === value && (
            <StyledIcon>
              <Svg id="check" />
            </StyledIcon>
          )}
          {t(label)}
        </ToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
};
