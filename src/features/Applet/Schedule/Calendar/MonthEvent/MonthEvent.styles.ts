import { styled, Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { shouldForwardProp } from 'utils/shouldForwardProp';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { StyledLabelBoldMedium } from 'styles/styledComponents/Typography';

export const StyledEvent = styled(StyledFlexTopCenter)`
  justify-content: space-between;

  > div:not(:last-child) {
    margin-right: ${theme.spacing(0.5)};
  }

  p:not(:last-child) {
    margin-right: ${theme.spacing(0.5)};
  }
`;

export const StyledStartIcon = styled(StyledFlexTopCenter, shouldForwardProp)`
  svg {
    fill: ${({ isWhite }: { isWhite: boolean }) =>
      isWhite ? variables.palette.white : variables.palette.on_surface};
  }
`;

export const StyledEndIcon = styled(StyledFlexTopCenter, shouldForwardProp)`
  svg {
    opacity: 0.62;
    fill: ${({ isWhite }: { isWhite: boolean }) =>
      isWhite ? variables.palette.white : variables.palette.on_surface};
  }
`;

export const StyledIndicator = styled(Box, shouldForwardProp)`
  flex-shrink: 0;
  height: 0.8rem;
  width: 0.8rem;
  border-radius: ${variables.borderRadius.half};
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor};
`;

export const StyledTitle = styled(StyledLabelBoldMedium, shouldForwardProp)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ isWhite }: { isWhite: boolean }) =>
    isWhite ? variables.palette.white : variables.palette.on_surface};
`;
