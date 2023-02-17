import { Box, styled } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledLabelBoldMedium } from 'styles/styledComponents';
import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledMore = styled(StyledLabelBoldMedium, shouldForwardProp)`
  margin-left: ${({ isWeekType }: { isWeekType: boolean }) => (isWeekType ? '0.5%' : 'unset')};
  pointer-events: auto;
  cursor: pointer;
  position: absolute;
  text-align: left;
  bottom: 0;
  color: ${variables.palette.on_surface_variant};
  padding: ${theme.spacing(0.3, 0)};
  transition: ${variables.transitions.opacity};

  &:hover {
    opacity: 0.8;
  }
`;

export const StyledWeekDayWrapper = styled(Box)`
  pointer-events: auto;
  cursor: pointer;
  display: inline-block;
  padding: ${theme.spacing(0.8, 0.8, 1.4)};
`;
