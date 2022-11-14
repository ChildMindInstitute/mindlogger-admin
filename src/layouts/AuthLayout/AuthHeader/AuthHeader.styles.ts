import { styled } from '@mui/system';
import { Box, Select, FormControl } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledAuthHeader = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  position: sticky;
  top: 0;
  background-color: ${variables.palette.primary50};
  padding: ${theme.spacing(1, 2.4)};
  z-index: 2;

  &:before,
  &:after {
    content: '';
  }
`;

export const StyledHeaderLogo = styled(Box)`
  text-align: center;
`;

export const StyledFormControl = styled(FormControl)`
  display: flex;
  width: 100%;
  align-items: end;
`;

export const StyledSelect = styled(Select)(() => ({
  fontWeight: 600,
  fontSize: variables.font.size.md,
  color: variables.palette.shades0,
  border: `${variables.borderWidth.md} solid ${variables.palette.shades0}`,

  '.MuiSelect-icon': {
    color: variables.palette.shades0,
  },
}));
