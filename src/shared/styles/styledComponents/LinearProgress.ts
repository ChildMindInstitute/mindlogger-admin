import { styled, LinearProgress } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledLinearProgress = styled(LinearProgress)`
  background-color: ${variables.palette.white};
  border-radius: ${variables.borderRadius.xs};
`;
