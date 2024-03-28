import { styled, Button } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { Search, Svg } from 'shared/components';

export const StyledButton = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledSvg = styled(Svg)`
  color: ${variables.palette.outline};
`;

export const StyledSearch = styled(Search)`
  max-width: 32rem;
`;
