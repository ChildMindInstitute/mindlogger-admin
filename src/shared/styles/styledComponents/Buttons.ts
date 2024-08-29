import { Button, styled } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

export const StyledClearedButton = styled(Button)`
  padding: 0;
  height: auto;
  min-width: unset;
`;

export const StyledIconButton = styled(StyledClearedButton)`
  width: 4rem;
  height: 4rem;

  &:hover {
    svg {
      fill: ${variables.palette.primary};
    }
  }
`;

export const StyledDirectoryUpButton = styled(Button)`
  color: ${variables.palette.on_surface_variant};
  font-weight: ${variables.font.weight.regular};
  position: absolute;
  left: 2.4rem;
  top: 1rem;
  z-index: 1;

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledSvgPrimaryColorBtn = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledLinkBtn = styled(StyledClearedButton)`
  color: ${variables.palette.primary};
  font-size: ${variables.font.size.md};
  font-weight: ${variables.font.weight.regular};
  line-height: ${variables.font.lineHeight.md};
  text-decoration: underline;

  &.MuiButton-text:hover {
    background-color: transparent;
  }
` as typeof Button;

export const StyledPlainLinkBtn = styled(StyledClearedButton)`
  color: ${variables.palette.primary};
  margin: ${theme.spacing(-0.4, -0.8)};
  padding: ${theme.spacing(0.4, 0.8)};

  &&:hover {
    background-color: transparent;
  }
`;
