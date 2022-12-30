import { Box } from '@mui/material';
import { styled } from '@mui/system';

import { variables } from 'styles/variables';
import theme from 'styles/theme';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledContainer = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(4.8, 2.4, 0, 6.8)};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${({ isOpen }: { isOpen: boolean }) => (isOpen ? '100%' : 0)};
  transition: ${variables.transitions.allLong};
  position: relative;
  border-left-color: ${variables.palette.surface_variant};
  border-left-style: solid;
  border-left-width: ${({ isOpen }: { isOpen: boolean }) =>
    isOpen ? variables.borderWidth.md : '0rem'};
`;

export const StyledButton = styled(StyledClearedButton)`
  position: absolute;
  right: ${theme.spacing(8)};
  top: ${theme.spacing(6.6)};
  padding: ${theme.spacing(0.8)};
`;
