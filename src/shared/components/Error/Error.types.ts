import { SxProps } from '@mui/material';
import { AxiosError } from 'axios';

import { ApiError } from 'shared/state';

export type ErrorProps = {
  error: AxiosError<ApiError> | null;
  sxProps?: SxProps;
};
