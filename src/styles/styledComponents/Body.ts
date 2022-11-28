import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { TOP_BAR_HEIGHT, FOOTER_HEIGHT } from 'utils/constants';

export const StyledBody = styled(Box)`
  height: calc(100vh - ${TOP_BAR_HEIGHT} - ${FOOTER_HEIGHT});
`;
