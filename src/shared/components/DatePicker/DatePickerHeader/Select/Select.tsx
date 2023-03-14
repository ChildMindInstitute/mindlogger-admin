import { MenuItem, Select as MuiSelect } from '@mui/material';

import { StyledLabelBoldLarge } from 'shared/styles/styledComponents';

import { SelectProps } from './Select.types';
import { StyledFormControl } from './Select.styles';

export const Select = ({ value, changeValue, options }: SelectProps) => (
  <StyledFormControl variant="standard" fullWidth>
    <MuiSelect value={value} onChange={changeValue}>
      {options.map((value) => (
        <MenuItem key={value} value={value}>
          <StyledLabelBoldLarge>{value}</StyledLabelBoldLarge>
        </MenuItem>
      ))}
    </MuiSelect>
  </StyledFormControl>
);
