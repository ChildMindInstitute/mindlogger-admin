import { Slider, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledSlider = styled(Slider)`
  .MuiSlider-mark {
    display: none;
  }

  .MuiSlider-markLabel {
    color: ${variables.palette.outline};
  }
`;
