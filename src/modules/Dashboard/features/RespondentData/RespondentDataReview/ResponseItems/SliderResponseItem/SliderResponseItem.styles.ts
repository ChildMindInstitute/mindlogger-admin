import { Slider, styled } from '@mui/material';

import { variables } from 'shared/styles';

export const StyledSlider = styled(Slider)`
  &[data-skipped='true'] {
    .MuiSlider-thumb {
      display: none;
    }
  }

  .MuiSlider-mark {
    display: none;
  }

  .MuiSlider-markLabel {
    color: ${variables.palette.outline};
  }
`;
