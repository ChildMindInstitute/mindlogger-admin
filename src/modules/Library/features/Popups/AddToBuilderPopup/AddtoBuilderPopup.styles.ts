import { FormControlLabel, styled } from '@mui/material';

import { theme } from 'shared/styles';

export const StyledTableFormControlLabel = styled(FormControlLabel)`
  display: flex;
  justify-content: space-between;
  margin: 0;
`;

export const StyledListFormControlLabel = styled(FormControlLabel)`
  margin: ${theme.spacing(0.6, 0)};
`;
