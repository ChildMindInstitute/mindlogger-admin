import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

import { StyledFlexColumn } from './Flex';

export const ContentContainer = styled(StyledFlexColumn)`
  height: 100%;
  padding: ${theme.spacing(4.8, 6.4)};
  overflow-y: auto;
`;

export const StyledAppletList = styled(Box)`
  flex: 1;
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  border-radius: ${variables.borderRadius.lg2};
`;

export const StyledAppletContainer = styled(Box)`
  padding: ${theme.spacing(3.2)};

  &:not(:last-child) {
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  }
`;
