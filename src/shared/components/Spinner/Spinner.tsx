import { CircularProgress } from '@mui/material';

import { StyledSpinner } from './Spinner.styles';
import { SpinnerProps, SpinnerUiType } from './Spinner.types';

export const Spinner = ({ uiType = SpinnerUiType.Primary }: SpinnerProps) => (
  <StyledSpinner className="spinner-container">
    <CircularProgress size={uiType === SpinnerUiType.Primary ? 60 : 50} />
  </StyledSpinner>
);
