import { styled } from '@mui/material';
import { StyledFlexAllCenter } from 'styles/styledComponents';

import { variables } from 'styles/variables';

export const StyledCustomCover = styled(StyledFlexAllCenter)`
  height: 4rem;
  width: 4rem;
  border-radius: ${variables.borderRadius.md};
  background-color: ${variables.palette.secondary};
  text-transform: uppercase;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${variables.borderRadius.md};
`;
