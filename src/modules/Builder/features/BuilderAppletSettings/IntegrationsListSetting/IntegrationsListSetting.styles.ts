import { Box, Link, styled } from '@mui/material';

import { StyledFlexAllCenter, StyledFlexColumn, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledIntegrationContainer = styled(StyledFlexColumn, shouldForwardProp)`
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};
  padding: ${theme.spacing(2.4)};
  margin: ${theme.spacing(1.2, 0)};
`;

export const StyledIntegration = styled(Box)`
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
