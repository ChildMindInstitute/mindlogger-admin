import { Box, Link, styled } from '@mui/material';

import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledProlificIntegration = styled(Box)`
  display: grid;
  grid-template-columns: 9.4rem 1fr auto;
  column-gap: 2rem;
`;

export const StyledStatusChip = styled(StyledFlexAllCenter)`
  width: fit-content;
  border-radius: ${variables.borderRadius.md};
  padding: ${theme.spacing(0.4, 0.8)};
  margin-bottom: ${theme.spacing(1.2)};
`;

export const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

export const StyledLinkConfiguration = styled(StyledLink)`
  padding: ${theme.spacing(0.4, 0.9)};
`;
