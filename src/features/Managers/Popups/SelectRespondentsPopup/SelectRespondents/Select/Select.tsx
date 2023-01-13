import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { Svg } from 'components';

import { SelectProps } from './Select.types';
import { StyledTextField, StyledLabel, StyledSvgContainer } from './Select.styles';

export const Select = ({ label, onChange, value, options }: SelectProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledFlexTopCenter>
      <StyledLabel>{t(label)}</StyledLabel>
      <StyledTextField
        select
        onChange={onChange}
        value={value}
        SelectProps={{
          IconComponent: () => (
            <StyledSvgContainer>
              <Svg id="navigate-down" width="9" height="9" />
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
