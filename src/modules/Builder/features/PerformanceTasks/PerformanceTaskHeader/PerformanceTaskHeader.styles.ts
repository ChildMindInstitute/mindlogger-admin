import { Button, styled } from '@mui/material';

import {
  StyledFlexAllCenter,
  StyledFlexSpaceBetween,
  theme,
  variables,
  commonStickyStyles,
} from 'shared/styles';

export const StyledWrapper = styled(StyledFlexSpaceBetween)`
  ${commonStickyStyles};
  padding: ${theme.spacing(0, 2.4)};
  border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  white-space: nowrap;
  z-index: ${theme.zIndex.appBar};
`;

export const StyledButton = styled(Button)`
  color: ${variables.palette.on_surface_variant};
`;

export const StyledContentWrapper = styled(StyledFlexAllCenter)`
  flex-direction: column;
  flex-grow: 1;
  padding: ${theme.spacing(0.85)};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.3rem;
    width: 100%;
    border-radius: 10rem 10rem 0 0;
    background-color: ${variables.palette.primary};
  }

  svg {
    fill: ${variables.palette.primary};
  }
`;
