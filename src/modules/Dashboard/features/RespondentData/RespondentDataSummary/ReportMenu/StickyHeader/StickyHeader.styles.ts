import { Box, styled } from '@mui/material';

import { commonEllipsisStyles } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledHeaderContainer = styled(Box, shouldForwardProp)`
  ${commonEllipsisStyles};
`;
