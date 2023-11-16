import { styled } from '@mui/material';

import { variables, StyledFlexAllCenter } from 'shared/styles';

export const StyledCustomCover = styled(StyledFlexAllCenter)`
  flex-shrink: 0;
  background-color: ${variables.palette.primary_container};
  text-transform: uppercase;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
