import { Box, styled } from '@mui/material';

import { StyledClearedButton, StyledFlexTopCenter, theme, variables } from 'shared/styles';

export const StyledCollapseBtn = styled(StyledFlexTopCenter)`
  width: 100%;
  justify-content: space-between;

  &:hover {
    background-color: transparent;
  }

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledCollapse = styled(Box)`
  border-top: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  padding: ${theme.spacing(2.2, 0)};
`;

export const StyledChildren = styled(Box)`
  padding-left: ${theme.spacing(0.9)};
`;

export const StyledItem = styled(StyledFlexTopCenter)`
  font-size: ${variables.font.size.label3};
  line-height: 2rem;
  font-weight: ${variables.font.weight.regular};
  margin-top: ${theme.spacing(2.4)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledIconBtn = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.6)};
`;
