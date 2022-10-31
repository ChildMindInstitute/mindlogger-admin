import { styled } from '@mui/system';
import { Box, Select, FormControl } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledAuthHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  position: sticky;
  top: 0;
  background-color: ${variables.palette.primary50};
  padding: 0.625rem 1.5rem;
  z-index: 2;

  &:before,
  &:after {
    content: '';
  }
`;

export const StyledFormControl = styled(FormControl)`
  display: flex;
  width: 100%;
  align-items: end;
`;

export const StyledSelect = styled(Select)(() => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: `${variables.palette.shades0}`,
  border: `0.0625rem solid ${variables.palette.shades0}`,

  '.MuiSelect-icon': {
    color: `${variables.palette.shades0}`,
  },
}));
