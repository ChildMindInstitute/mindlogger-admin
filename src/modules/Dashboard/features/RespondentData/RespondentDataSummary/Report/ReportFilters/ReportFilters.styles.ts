import { styled } from '@mui/material';

import { StyledBodyMedium, variables } from 'shared/styles';

export const StyledForm = styled('form')``;

export const StyledTimeText = styled(StyledBodyMedium)`
  color: ${variables.palette.on_surface_variant};
  position: absolute;
  text-align: left;
  width: 14rem;
  bottom: -2rem;
  left: 4rem;
}
`;
