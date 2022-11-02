import { AxiosError } from 'axios';

export type MetaStatus = 'idle' | 'loading' | 'success' | 'error';

export type ErrorResponse = {
  message: string;
  type: string;
};

export type MetaSchema = {
  requestId: string;
  status: MetaStatus;
  error?: AxiosError<ErrorResponse>;
};

export type BaseSchema<DataType = unknown> = MetaSchema & {
  data: DataType;
};

export type ApiError = {
  message: string;
  type: string;
};
