import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButtonGroup as MuiToggleButtonGroup } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';

import { StyledIcon, StyledToggleBtn } from './ToggleButtonGroup.styles';
import { ToggleButtonGroupProps } from './ToggleButtonGroup.types';

export const ToggleButtonGroup = ({
  toggleButtons,
  activeButton,
  setActiveButton,
  customChange,
  'data-testid': dataTestid,
}: ToggleButtonGroupProps) => {
  const { t } = useTranslation('app');

  const handleChange = (e: MouseEvent<HTMLElement>, selected: string | number) => {
    if (selected || selected === 0) {
      customChange && customChange(selected);
      setActiveButton && setActiveButton(selected);
    }
  };

  return (
    <MuiToggleButtonGroup
      fullWidth
      value={activeButton}
      exclusive
      onChange={handleChange}
      data-testid={dataTestid}
    >
      {toggleButtons.map(({ value, label, tooltip, icon }, index) => (
        <StyledToggleBtn
          sx={{ flex: `0 0 calc(100% / ${toggleButtons.length})` }}
          withIcon={!!icon}
          key={value}
          value={value}
          data-testid={`${dataTestid}-${index}`}
        >
          {activeButton === value && !icon && (
            <StyledIcon>
              <Svg id="check" />
            </StyledIcon>
          )}
          {icon && <StyledIcon>{icon}</StyledIcon>}
          <Tooltip tooltipTitle={t(tooltip || '')}>
            <span> {t(label)}</span>
          </Tooltip>
        </StyledToggleBtn>
      ))}
    </MuiToggleButtonGroup>
  );
};
