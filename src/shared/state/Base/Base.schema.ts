import { ErrorResponseType } from 'shared/api';

export type MetaStatus = 'idle' | 'loading' | 'success' | 'error';

export type ErrorResponse = {
  message: {
    en: string;
  };
  path: string[];
  type: ErrorResponseType;
};

export type MetaSchema = {
  requestId: string;
  status: MetaStatus;
  error?: ErrorResponse[];
  typePrefix?: string;
};

export type BaseSchema<DataType = unknown> = MetaSchema & {
  data: DataType;
};

export type ApiError = {
  message: string;
  type: string;
};
