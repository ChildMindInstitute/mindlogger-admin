import { Box, Collapse, styled } from '@mui/material';

import { StyledIconButton, theme, variables } from 'shared/styles';
import { blendColorsNormal } from 'shared/utils/colors';

export const StyledCollapse = styled(Collapse)`
  margin: ${theme.spacing(-2.4, -1.6, -1.6)};
`;

export const StyledContainer = styled(Box)`
  position: relative;
  background-color: ${blendColorsNormal(
    variables.palette.surface,
    variables.palette.yellow_alfa30,
  )};
  color: ${variables.palette.on_surface};
  padding: ${theme.spacing(1.2, 1.6)};

  .svg-exclamation-circle {
    fill: ${variables.palette.yellow};
  }
`;

export const StyledContent = styled(Box)`
  display: grid;
  grid-template-columns: 2.2rem auto 3rem;
  grid-template-rows: auto auto;
  column-gap: 1.2rem;
  grid-template-areas:
    '. header button'
    '. text button';
`;

export const StyledButton = styled(StyledIconButton)`
  width: 3rem;
  height: 3rem;
  margin-top: ${theme.spacing(-0.5)};
  grid-area: button;
`;
