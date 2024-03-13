import { Box, styled } from '@mui/material';

import { commonEllipsisStyles, theme } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledHeaderContainer = styled(Box, shouldForwardProp)`
  ${commonEllipsisStyles};
  ${({ isSticky }: { isSticky: boolean }) => !isSticky && `margin-top: ${theme.spacing(2.4)}`}
`;
