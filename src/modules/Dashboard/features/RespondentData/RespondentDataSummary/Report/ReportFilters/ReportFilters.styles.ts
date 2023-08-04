import { Box, Button, styled } from '@mui/material';

import { StyledBodyMedium, theme, variables } from 'shared/styles';

export const StyledFiltersContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fill, 42rem);
  grid-gap: 3.4rem;
  margin-bottom: ${theme.spacing(4.8)};
`;

export const StyledTimeText = styled(StyledBodyMedium)`
  color: ${variables.palette.on_surface_variant};
  position: absolute;
  text-align: left;
  width: 14rem;
  bottom: -2rem;
  left: 1rem;
`;

export const StyledMoreFilters = styled(Button)`
  height: 5.5rem;
  margin-left: ${theme.spacing(1.2)};
`;
