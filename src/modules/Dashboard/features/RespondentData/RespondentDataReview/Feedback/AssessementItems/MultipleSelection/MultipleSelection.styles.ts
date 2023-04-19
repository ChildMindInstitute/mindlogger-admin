import { FormControlLabel, styled } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexAllCenter, theme, variables } from 'shared/styles';

export const StyledFormControlLabel = styled(FormControlLabel)`
  .Mui-disabled {
    img {
      opacity: 0.68;
    }

    .MuiTypography-root {
      opacity: 0.68;
    }

    .tooltipContainer {
      pointer-events: none;
    }
  }
`;

export const StyledImage = styled('img')`
  width: 2.4rem;
  height: 2.4rem;
  object-fit: cover;
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.xs};
  margin-right: ${theme.spacing(1.2)};
`;

export const StyledLabel = styled(StyledFlexAllCenter)`
  margin-left: ${theme.spacing(1.2)};
`;

export const StyledSvg = styled(Svg)`
  fill: ${variables.palette.outline};
  margin-left: ${theme.spacing(1)};
`;
