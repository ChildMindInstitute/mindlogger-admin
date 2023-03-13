import { styled } from '@mui/material';
import { StyledFlexAllCenter } from 'shared/styles/styledComponents';

import { variables } from 'shared/styles/variables';

export const StyledAppletImageContainer = styled(StyledFlexAllCenter)`
  grid-row-start: 1;
  grid-row-end: 3;
  height: 10.4rem;
  width: 10.4rem;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${variables.borderRadius.md};
`;

export const StyledCustomCover = styled(StyledFlexAllCenter)`
  width: 100%;
  height: 100%;
  border-radius: ${variables.borderRadius.md};
  background-color: ${variables.palette.primary_container};
  text-transform: uppercase;
`;
