import { Box, styled } from '@mui/material';

import {
  ellipsisTextCss,
  StyledFlexTopCenter,
  StyledTitleLargish,
  theme,
  variables,
} from 'shared/styles';

export const StyledActivityListItem = styled(Box)(
  ({ onClick }: { onClick?: () => void }) => `
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};
  overflow: hidden;

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

export const StyledActivityListItemInner = styled(StyledFlexTopCenter)`
  flex-wrap: wrap;
  padding: ${theme.spacing(1.5)};
  column-gap: ${theme.spacing(1.6)};
  row-gap: ${theme.spacing(0.8)};
  position: relative;
  background-color: ${variables.palette.surface};

  [aria-label] > .MuiChip-root,
  button:not(.primary-button) {
    position: relative;
    z-index: 1;
  }

  button:not(.primary-button) {
    /* Add click slop for secondary buttons */
    &::after {
      content: '';
      position: absolute;
      inset: -${theme.spacing(0.8)};
    }
  }

  .primary-button {
    position: static;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-color: transparent;
      transition: ${variables.transitions.bgColor};
    }

    &:hover::after,
    &:focus::after {
      background-color: ${variables.palette.on_surface_variant_alfa8};
    }
  }

  button {
    position: relative;
  }
`;

export const StyledActivityName = styled(StyledTitleLargish)`
  ${ellipsisTextCss}
`;
