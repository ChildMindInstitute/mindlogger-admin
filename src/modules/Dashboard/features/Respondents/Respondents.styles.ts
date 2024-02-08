import { styled, Box, Button } from '@mui/material';

import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export const RespondentsTableHeader = styled(Box, shouldForwardProp)`
  margin-bottom: ${theme.spacing(2.4)};
  display: flex;
  justify-content: ${({ hasButton }: { hasButton: boolean }) => (hasButton ? 'space-between' : 'center')};
`;

export const StyledButton = styled(Button)`
  svg {
    fill: ${variables.palette.primary};
  }
`;

export const StyledLeftBox = styled(StyledFlexTopCenter)`
  margin-right: ${theme.spacing(1)};
  flex: 0 0 25%;
`;

export const StyledRightBox = styled(Box)`
  margin-left: ${theme.spacing(1)};
  flex: 0 0 25%;
`;
