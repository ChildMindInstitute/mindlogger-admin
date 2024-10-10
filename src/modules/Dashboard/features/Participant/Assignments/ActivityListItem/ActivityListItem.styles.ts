import { Box, styled } from '@mui/material';

import { ellipsisTextCss, StyledTitleLargish, variables } from 'shared/styles';

export const StyledActivityListItem = styled(Box)(
  ({ onClick }: { onClick?: () => void }) => `
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};
  background-color: ${variables.palette.surface};
  transition: ${variables.transitions.bgColor};

  ${
    onClick &&
    `cursor: pointer;

    &:hover,
    &:focus {
      background-color: ${variables.palette.on_surface_variant_alfa8};
    }`
  }
`,
);

export const StyledActivityName = styled(StyledTitleLargish)`
  ${ellipsisTextCss}
`;
