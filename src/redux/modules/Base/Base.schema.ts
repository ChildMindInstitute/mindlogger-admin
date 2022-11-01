import { SerializedError } from '@reduxjs/toolkit';

export type MetaStatus = 'idle' | 'loading' | 'success' | 'error';

export type MetaSchema = {
  requestId: string;
  status: MetaStatus;
  error?: SerializedError;
};

export type BaseSchema<DataType = unknown> = MetaSchema & {
  data: DataType;
};

export type ApiError = {
  message: string;
  type: string;
};
