import { styled } from '@mui/system';
import { Box, Button } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { Svg } from 'components/Svg';

export const RespondentsTableHeader = styled(Box)`
  margin-bottom: ${theme.spacing(2.4)};
  display: flex;
  justify-content: ${({ hasButton }: { hasButton: boolean }) =>
    hasButton ? 'space-between' : 'center'};
`;

export const StyledSvg = styled(Svg)`
  margin-right: ${theme.spacing(1)};
`;

export const StyledButton = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledLeftBox = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(1)};
  flex: 0 0 25%;
`;

export const StyledRightBox = styled(Box)`
  margin-left: ${theme.spacing(1)};
  flex: 0 0 25%;
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
    fill: ${variables.palette.on_surface_variant};
  }
`;
