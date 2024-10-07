import { styled } from '@mui/material';

import {
  ellipsisTextCss,
  StyledFlexTopCenter,
  StyledTitleLargish,
  theme,
  variables,
} from 'shared/styles';

export const StyledActivityListItem = styled(StyledFlexTopCenter)(
  ({ onClick }: { onClick?: () => void }) => `
  flex-wrap: wrap;
  padding: ${theme.spacing(1.5)};
  gap: ${theme.spacing(0.8, 4.8)};
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
