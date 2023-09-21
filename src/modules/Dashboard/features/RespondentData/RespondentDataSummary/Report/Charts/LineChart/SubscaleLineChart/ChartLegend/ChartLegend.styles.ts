import { Box, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledColorBox = styled(Box, shouldForwardProp)`
  width: 2.4rem;
  height: 0.9rem;
  border-radius: ${variables.borderRadius.xxs};
  margin: ${theme.spacing(0, 0.8)};
  background-color: ${({ bgColor }: { bgColor: string }) => bgColor};
`;
