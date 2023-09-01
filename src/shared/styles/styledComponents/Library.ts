import styled from '@emotion/styled/macro';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

import { StyledFlexAllCenter, StyledFlexColumn } from './Flex';

export const ContentContainer = styled(StyledFlexColumn)`
  height: 100%;
  padding: ${theme.spacing(4.8, 6.4)};
  overflow-y: auto;
`;

export const StyledAppletList = styled(Box)`
  flex: 1;
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};

  .marked {
    background-color: ${variables.palette.yellow};
    border-radius: ${variables.borderRadius.xs};
  }
`;

export const StyledAppletContainer = styled(Box)`
  padding: ${theme.spacing(3.2)};

  &:not(:last-child) {
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;

export const StyledSvgArrowContainer = styled(StyledFlexAllCenter)`
  width: 4rem;
  height: 4rem;
  border-radius: ${variables.borderRadius.half};
  transition: ${variables.transitions.bgColor};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
