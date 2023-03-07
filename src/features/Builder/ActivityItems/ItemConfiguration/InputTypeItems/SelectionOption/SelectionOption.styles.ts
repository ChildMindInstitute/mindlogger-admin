import { styled } from '@mui/system';
import { Box } from '@mui/material';

import theme from 'styles/theme';
import { variables } from 'styles/variables';
import {
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
} from 'styles/styledComponents';

import { shouldForwardProp } from 'utils/shouldForwardProp';

export const StyledItemOption = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(1.6, 2.4)};
  margin-bottom: ${theme.spacing(2.4)};
  background-color: ${variables.palette.surface1};
  border-radius: ${variables.borderRadius.lg2};

  svg {
    fill: ${variables.palette.on_surface_variant};
  }
`;

export const StyledAction = styled(StyledClearedButton)`
  padding: ${theme.spacing(0.5)};
  margin-left: ${theme.spacing(1)};

  &:first-of-type {
    margin-left: 0;
  }
`;

export const StyledCollapsedWrapper = styled(StyledFlexTopCenter)`
  margin: ${theme.spacing(0, 1)};
`;

export const StyledTooltipWrapper = styled(StyledFlexColumn)`
  width: calc(100% - 5rem);
  margin-left: auto;
  align-items: flex-end;
`;
