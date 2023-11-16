import { styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledImageContainer = styled(StyledFlexAllCenter)`
  width: 5.6rem;
  height: 5.6rem;
  flex-shrink: 0;
  border-radius: ${variables.borderRadius.xs};
  background-color: ${variables.palette.primary_container};

  &:first-of-type {
    margin-right: ${theme.spacing(1)};
  }
`;

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
