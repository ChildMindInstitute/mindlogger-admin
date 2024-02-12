import { styled } from '@mui/material';

import { StyledClearedButton, StyledFlexTopStart, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { shouldForwardProp } from 'shared/utils';

export const StyledSvgButton = styled(StyledClearedButton)`
  position: absolute;
  right: ${theme.spacing(2)};
`;

export const StyledSvg = styled(Svg, shouldForwardProp)`
  ${({ isFilled }: { isFilled: boolean }) => `
    && {
      fill: ${isFilled ? variables.palette.primary : variables.palette.on_surface_variant};
    }
  `}
`;

export const StyledButtonsContainer = styled(StyledFlexTopStart)`
  gap: 1.2rem;
  margin-top: ${theme.spacing(2.9)};
  flex-direction: column;
`;
