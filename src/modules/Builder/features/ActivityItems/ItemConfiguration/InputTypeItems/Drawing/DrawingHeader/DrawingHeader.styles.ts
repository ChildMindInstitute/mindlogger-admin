import { styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledImage = styled('img')`
  object-fit: cover;
  width: 5.6rem;
  height: 5.6rem;
  border-radius: ${variables.borderRadius.xs};
  margin-right: 0;

  &:not(:last-of-type) {
    margin-right: ${theme.spacing(1)};
  }
`;
