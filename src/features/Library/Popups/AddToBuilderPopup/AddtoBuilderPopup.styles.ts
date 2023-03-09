import { FormControlLabel, styled } from '@mui/material';

import theme from 'styles/theme';

export const StyledTableFormControlLabel = styled(FormControlLabel)`
  display: flex;
  justify-content: space-between;
  margin: 0;
`;

export const StyledListFormControlLabel = styled(FormControlLabel)`
  margin: ${theme.spacing(0.6, 0)};
`;
