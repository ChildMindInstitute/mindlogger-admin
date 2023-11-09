import { SxProps } from '@mui/material';
import { AxiosError } from 'axios';

import { ApiErrorResponse } from 'shared/state';

export type ErrorProps = {
  error: AxiosError<ApiErrorResponse> | null;
  sxProps?: SxProps;
};
