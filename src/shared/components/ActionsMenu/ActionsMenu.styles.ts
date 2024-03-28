import { styled } from '@mui/material';

import { variables, StyledIconButton } from 'shared/styles';

export const StyledButton = styled(StyledIconButton)(({ color }) => {
  const fillColor = color === 'secondary' ? 'outline_variant' : 'on_surface_variant';

  return {
    svg: {
      fill: variables.palette[fillColor],
    },
  };
});
