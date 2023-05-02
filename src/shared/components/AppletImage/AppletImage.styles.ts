import { styled } from '@mui/material';

import { theme, variables, StyledFlexAllCenter } from 'shared/styles';

export const StyledCustomCover = styled(StyledFlexAllCenter)`
  height: 3.2rem;
  width: 3.2rem;
  flex-shrink: 0;
  border-radius: ${variables.borderRadius.xxs};
  background-color: ${variables.palette.primary_container};
  margin-right: ${theme.spacing(1.2)};
  text-transform: uppercase;
`;

export const StyledImage = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${variables.borderRadius.xs};
`;
