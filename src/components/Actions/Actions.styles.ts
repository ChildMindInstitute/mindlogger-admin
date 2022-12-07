import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';

import { Svg } from 'components/Svg';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledActionsWrapper = styled(StyledFlexTopCenter)`
  width: 100%;
  height: 100%;
`;

export const StyledSvg = styled(Svg)`
  margin-right: ${theme.spacing(1)};
`;

export const StyledActions = styled(Box)`
  display: flex;
`;

export const StyledActionButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  min-width: 4rem;
  padding: 0;
  border-radius: ${variables.borderRadius.half};
  margin-right: ${theme.spacing(1)};

  &:hover {
    background: ${variables.palette.secondary_container};

    svg {
      fill: ${variables.palette.primary};
    }
  }

  svg {
    fill: ${({ disabled }: { disabled: boolean }) =>
      disabled ? variables.palette.surface_variant : variables.palette.on_surface_variant};
  }
`;
