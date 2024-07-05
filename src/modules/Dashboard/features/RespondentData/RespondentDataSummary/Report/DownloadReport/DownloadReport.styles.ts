import { CircularProgress, styled } from '@mui/material';

import { CIRCULAR_PROGRESS_SIZE } from './DownloadReport.const';

export const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -${CIRCULAR_PROGRESS_SIZE / 20}rem;
  margin-left: -${CIRCULAR_PROGRESS_SIZE / 20}rem;
`;
