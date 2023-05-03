import { Box, Button, styled } from '@mui/material';

import { Svg } from 'shared/components';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledItem = styled(Box, shouldForwardProp)`
  padding: ${theme.spacing(3.6, 3.2)};
  border-radius: ${variables.borderRadius.lg2};
  margin-bottom: ${theme.spacing(1.6)};
  cursor: pointer;
  background-color: ${variables.palette.surface1};
`;

export const StyledButton = styled(Button)`
  margin-left: ${theme.spacing(1.6)};
`;

export const StyledHeader = styled(StyledFlexTopCenter)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledSvg = styled(Svg)`
  margin-right: ${theme.spacing(2.2)};
  margin-left: ${theme.spacing(1)};
`;
