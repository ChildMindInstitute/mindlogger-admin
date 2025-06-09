import { Slider, styled } from '@mui/material';

import { StyledFlexColumn, theme, variables } from 'shared/styles';

export const StyledSlider = styled(Slider)`
  margin-bottom: ${theme.spacing(3.6)};

  &.Mui-disabled {
    color: ${variables.palette.on_surface};
    opacity: ${variables.opacity.disabled};

    .MuiSlider-rail {
      background-color: ${variables.palette.on_surface_alpha12};
    }

    .MuiSlider-mark {
      opacity: ${variables.opacity.disabled};
      background-color: ${variables.palette.on_surface};

      &.MuiSlider-markActive {
        background-color: ${variables.palette.on_surface};
      }
    }
  }

  .MuiSlider-rail {
    background-color: ${variables.palette.surface_variant};
    opacity: 1;
  }

  .MuiSlider-mark {
    opacity: ${variables.opacity.disabled};
    background-color: ${variables.palette.on_surface_variant};

    &.MuiSlider-markActive {
      background-color: ${variables.palette.white};
    }
  }

  .MuiSlider-markLabel {
    color: ${variables.palette.outline};
  }

  .MuiSlider-valueLabel {
    font-size: ${variables.font.size.sm};
    line-height: ${variables.font.lineHeight.sm};
    width: 3.2rem;
    height: 3.2rem;
    border-radius: ${variables.borderRadius.half} ${variables.borderRadius.half}
      ${variables.borderRadius.half} 0;
    background-color: ${variables.palette.primary};
    transform-origin: bottom left;
    transform: translate(50%, -100%) rotate(-45deg) scale(0);

    &:before {
      display: none;
    }

    &.MuiSlider-valueLabelOpen {
      transform: translate(50%, -100%) rotate(-45deg) scale(1);
    }

    & > * {
      transform: rotate(45deg);
    }
  }
`;

export const StyledDescriptionItem = styled(StyledFlexColumn)`
  max-width: 16rem;
`;

export const StyledImage = styled('img')`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xs};
  margin-bottom: ${theme.spacing(1.6)};
`;
