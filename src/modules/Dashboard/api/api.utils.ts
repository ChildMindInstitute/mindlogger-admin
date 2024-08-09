import { DEFAULT_ROWS_PER_PAGE } from './api.const';

export const getExportPageAmount = (total: number) => Math.ceil(total / DEFAULT_ROWS_PER_PAGE);
