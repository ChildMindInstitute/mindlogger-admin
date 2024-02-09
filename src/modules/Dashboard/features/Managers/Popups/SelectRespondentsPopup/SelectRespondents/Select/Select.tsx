import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { StyledTextField, StyledLabel, StyledSvgContainer } from './Select.styles';
import { SelectProps } from './Select.types';

export const Select = ({ label, onChange, value, options, 'data-testid': dataTestId }: SelectProps) => {
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
