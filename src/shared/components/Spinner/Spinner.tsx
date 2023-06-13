import { CircularProgress } from '@mui/material';

import { StyledSpinner } from './Spinner.styles';

export const Spinner = () => (
  <StyledSpinner className="spinner-container">
    <CircularProgress size={60} />
  </StyledSpinner>
);
