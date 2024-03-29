import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { Svg } from 'shared/components/Svg';

import { SelectProps } from './Select.types';
import { StyledTextField, StyledLabel, StyledSvgContainer } from './Select.styles';

export const Select = ({
  label,
  onChange,
  value,
  options,
  'data-testid': dataTestId,
}: SelectProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledFlexTopCenter data-testid={dataTestId}>
      <StyledLabel>{t(label)}</StyledLabel>
      <StyledTextField
        select
        onChange={onChange}
        value={value}
        SelectProps={{
          IconComponent: () => (
            <StyledSvgContainer>
              <Svg id="navigate-down" width="18" height="18" />
            </StyledSvgContainer>
          ),
        }}
      >
        {options?.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {t(label)}
          </MenuItem>
        ))}
      </StyledTextField>
    </StyledFlexTopCenter>
  );
};
