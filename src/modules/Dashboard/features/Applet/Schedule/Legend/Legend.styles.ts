import { styled, Box } from '@mui/material';

import { theme, variables, StyledFlexTopCenter } from 'shared/styles';

export const StyledLegend = styled(Box)`
  padding: ${theme.spacing(1.2, 1.6, 0)};
  overflow: auto;
`;

export const StyledIndicator = styled(Box)`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  position: relative;
  background-color: ${({ colors }: { colors: string[] }) => colors[1]};
  border-radius: ${variables.borderRadius.xs};
  margin-right: ${theme.spacing(1.2)};

  &:before {
    content: '';
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
    background-color: ${({ colors }) => colors[0]};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${variables.borderRadius.half};
  }
`;

export const StyledCreateBtn = styled(StyledFlexTopCenter)`
  cursor: pointer;
  color: ${variables.palette.outline};

  svg {
    margin-right: ${theme.spacing(1)};
  }
`;

export const StyledDeactivated = styled(StyledFlexTopCenter)`
  color: ${variables.palette.on_surface_alfa38};
`;
