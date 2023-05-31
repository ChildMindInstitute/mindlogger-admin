import { Button, styled } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledSvgPrimaryColorBtn = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;
