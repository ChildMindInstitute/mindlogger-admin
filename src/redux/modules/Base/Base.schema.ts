import { SerializedError } from '@reduxjs/toolkit';

export type MetaStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MetaSchema {
  requestId: string;
  status: MetaStatus;
  error?: SerializedError;
}

export interface BaseSchema<DataType = unknown> extends MetaSchema {
  data: DataType;
}

export interface ApiError {
  message: string;
  type: string;
}
