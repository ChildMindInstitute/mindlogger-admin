import { Box, styled } from '@mui/material';

import { theme, variables, StyledFlexAllCenter } from 'shared/styles';

export const Disabled = `
    color: ${variables.palette.on_surface};
    opacity: 0.64;
`;

export const SelectedDisabled = `
    color: ${variables.palette.on_surface_variant};
    opacity: 1;
`;

export const StyledReview = styled(Box)`
  padding: ${theme.spacing(2.4, 6, 4)};
`;

export const StyledEmptyReview = styled(StyledFlexAllCenter)`
  flex-direction: column;
  width: 40rem;
  height: 100%;
  text-align: center;

  svg {
    fill: ${variables.palette.outline};
  }
`;

export const StyledWrapper = styled(StyledFlexAllCenter)`
  height: calc(100% - 9.6rem);
`;
