import { styled } from '@mui/system';
import { LinearProgress } from '@mui/material';

import { variables } from 'styles/variables';

export const StyledLinearProgress = styled(LinearProgress)`
  background-color: ${variables.palette.white};
  border-radius: ${variables.borderRadius.xs};
`;
