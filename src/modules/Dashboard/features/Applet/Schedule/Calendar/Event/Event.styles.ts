import { styled, Box } from '@mui/material';

import { shouldForwardProp } from 'shared/utils';
import {
  theme,
  variables,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledLabelBoldMedium,
} from 'shared/styles';

export const StyledEvent = styled(Box, shouldForwardProp)`
  width: 100%;
  padding: ${({ isScheduledDayWeekEvent }: { isScheduledDayWeekEvent: boolean }) =>
    isScheduledDayWeekEvent ? theme.spacing(0.2, 0.8) : theme.spacing(0.2, 0.4)};
`;

export const StyledWrapper = styled(StyledFlexTopCenter)`
  width: 100%;
  justify-content: space-between;
`;

export const StyledLeftSection = styled(StyledFlexTopStart)`
  width: calc(100% - 1.5rem);

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
  align-self: center;
`;

export const StyledTitle = styled(StyledLabelBoldMedium, shouldForwardProp)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ isWhite }: { isWhite?: boolean }) =>
    isWhite ? variables.palette.white : variables.palette.on_surface};
`;
