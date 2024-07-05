import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const Disabled = `
    color: ${variables.palette.on_surface};
    opacity: ${variables.opacity.halfDisabled};
`;

export const SelectedDisabled = `
    color: ${variables.palette.on_surface_variant};
    opacity: ${variables.opacity.noOpacity};
`;

export const StyledReview = styled(Box)`
  padding: ${theme.spacing(2.4, 0, 2.5)};
`;
