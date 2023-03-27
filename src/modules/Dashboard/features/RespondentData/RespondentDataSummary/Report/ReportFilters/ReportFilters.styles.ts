import { styled } from '@mui/system';

import { StyledBodyMedium, variables } from 'shared/styles';

export const StyledForm = styled('form')`
  display: flex;
  align-items: center;
`;

export const StyledTimeText = styled(StyledBodyMedium)`
  color: ${variables.palette.on_surface_variant};
  position: absolute;
  text-align: left;
  width: 8.8rem;
  bottom: -4rem;
  left: 50%;
  transform: translate(-50%, 0);
}
`;
