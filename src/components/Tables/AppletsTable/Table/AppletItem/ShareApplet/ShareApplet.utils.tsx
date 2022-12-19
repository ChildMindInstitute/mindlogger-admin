import { AxiosError } from 'axios';

import { ApiError } from 'redux/modules';
import { StyledErrorText } from 'styles/styledComponents/ErrorText';

export const getErrorComponent = (error: AxiosError<ApiError>) => (
  <StyledErrorText marginTop={0}>{error.response?.data?.message || error.message}</StyledErrorText>
);
