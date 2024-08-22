import { styled, LinearProgress } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledLinearProgress = styled(LinearProgress)`
  background-color: ${variables.palette.white};
  border-radius: ${variables.borderRadius.xs};
`;

export const StyledLinearProgressLarge = styled(LinearProgress)`
  background-color: ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xxxl2};
  height: 1.2rem;
`;
