import { ErrorResponseType } from 'shared/types';

export type MetaStatus = 'idle' | 'loading' | 'success' | 'error';

export type ApiError = {
  message: string;
  type: ErrorResponseType;
  path: string[];
};

export type ApiErrorResponse = {
  result?: ApiError[];
  detail?: string;
};

export type ApiErrorReturn = ApiError[] | string;

export type MetaSchema = {
  requestId: string;
  status: MetaStatus;
  error?: ApiErrorReturn;
  typePrefix?: string;
};

export type BaseSchema<DataType = unknown> = MetaSchema & {
  data: DataType;
};
