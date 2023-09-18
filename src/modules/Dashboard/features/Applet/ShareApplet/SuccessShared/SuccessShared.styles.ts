import { styled, Box, Button } from '@mui/material';

import { theme, variables, StyledBodyLarge } from 'shared/styles';

export const StyledSuccessShared = styled(Box)`
  padding: ${theme.spacing(2.4)};
`;

export const StyledApplet = styled(Box)`
  display: grid;
  grid-template-columns: 9.2rem 39.6rem;
  grid-column-gap: 1.6rem;
  padding: ${theme.spacing(2.4)};
  background-color: ${variables.palette.surface5};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledText = styled(StyledBodyLarge)`
  flex-basis: 100%;
  margin-top: ${theme.spacing(1.2)};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const StyledLinkBtn = styled(Button)`
  margin-top: ${theme.spacing(2.4)};

  svg {
    fill: ${variables.palette.primary};
  }
`;
