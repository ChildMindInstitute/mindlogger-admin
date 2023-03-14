import { styled } from '@mui/system';

import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import { StyledClearedButton, StyledFlexColumn } from 'shared/styles/styledComponents';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const StyledContainer = styled(StyledFlexColumn, shouldForwardProp)`
  padding: ${theme.spacing(4.8, 2.4, 0, 6.8)};
  height: 100%;
  overflow-y: auto;
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
  right: ${theme.spacing(6.4)};
  top: ${theme.spacing(4.8)};
  padding: ${theme.spacing(0.8)};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;
