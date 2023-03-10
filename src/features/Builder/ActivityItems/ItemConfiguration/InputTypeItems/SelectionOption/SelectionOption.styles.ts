import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledFlexColumn, StyledFlexTopCenter } from 'styles/styledComponents';

import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledItemOption = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(1.6, 2.4, 1.6, 3.4)};
  margin-bottom: ${theme.spacing(2.4)};
  background-color: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};
  position: relative;

  && {
    svg {
      fill: ${variables.palette.on_surface_variant};
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2.4rem;
    height: 100%;
    border-top-left-radius: ${variables.borderRadius.lg2};
    border-bottom-left-radius: ${variables.borderRadius.lg2};
    background-color: ${({ leftBorderColor }: { leftBorderColor?: string }) =>
      leftBorderColor || 'transparent'};
  }
`;

export const StyledCollapsedWrapper = styled(StyledFlexTopCenter)`
  margin: ${theme.spacing(0, 1)};
`;

export const StyledTextInputWrapper = styled(Box, shouldForwardProp)`
  flex-grow: 1;
  margin-right: ${({ hasScores }: { hasScores: boolean }) => (hasScores ? theme.spacing(1) : 0)};
`;

export const StyledScoreWrapper = styled(Box)`
  width: 15.4rem;
`;

export const StyledTooltipWrapper = styled(StyledFlexColumn)`
  width: calc(100% - 10.9rem);
  margin-left: auto;
  text-align: right;
`;
