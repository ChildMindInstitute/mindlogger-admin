import { styled } from '@mui/system';
import { Box } from '@mui/material';

import { TOP_BAR_HEIGHT } from 'components/TopBar';
import { FOOTER_HEIGHT } from 'layouts/Footer';

export const StyledDashboard = styled(Box)`
  height: calc(100vh - ${TOP_BAR_HEIGHT} - ${FOOTER_HEIGHT});
  padding: 1rem;
`;
