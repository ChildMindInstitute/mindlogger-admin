import { styled } from '@mui/material';

import { variables } from '../variables';
import { StyledClearedButton } from './ClearedButton';

export const StyledIconButton = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  svg:hover {
    fill: ${variables.palette.primary};
  }
`;
