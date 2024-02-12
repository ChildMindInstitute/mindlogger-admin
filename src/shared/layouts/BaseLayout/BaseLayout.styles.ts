import { styled, Box } from '@mui/material';

import { LEFT_BAR_WIDTH } from 'shared/consts';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';
import { StyledFlexColumn } from 'shared/styles/styledComponents';

export const StyledBaseLayout = styled(Box)`
  height: 100vh;
  display: flex;
`;

export const StyledCol = styled(StyledFlexColumn, shouldForwardProp)`
  width: ${({ isAuthorized = false }: { isAuthorized: boolean }) =>
    isAuthorized ? `calc(100% - ${LEFT_BAR_WIDTH})` : '100%'};
`;
