import { MenuItem, Select as MuiSelect } from '@mui/material';

import { StyledLabelLarge } from 'styles/styledComponents/Typography';

import { SelectProps } from './Select.types';
import { StyledFormControl } from './Select.styles';

export const Select = ({ value, changeValue, options }: SelectProps) => (
  <StyledFormControl variant="standard" fullWidth>
    <MuiSelect value={value} onChange={changeValue}>
      {options.map((value) => (
        <MenuItem key={value} value={value}>
          <StyledLabelLarge fontWeight="semiBold">{value}</StyledLabelLarge>
        </MenuItem>
      ))}
    </MuiSelect>
  </StyledFormControl>
);
