import { Box, styled } from '@mui/material';

import { StyledFlexColumn, StyledHeadlineLarge, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(1.2, 2.4)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(0.5)};
  cursor: pointer;

  &:hover {
    background-color: ${variables.palette.on_surface_alfa8};
  }

  ${({ isSelected }: { isSelected: boolean }) =>
    isSelected &&
    `
    background-color: ${variables.palette.surface2};
    p {
      font-weight: ${variables.font.weight.bold};
    }

    &:hover {
      background-color: ${variables.palette.surface2};
    }
  `}
`;

export const StyledContainer = styled(StyledFlexColumn)`
  padding: ${theme.spacing(0, 1.6, 1.5)};
`;

export const StyledTitle = styled(StyledHeadlineLarge)`
  color: ${variables.palette.on_surface};
  padding: ${theme.spacing(0, 2.4, 1)};
`;
