import { DEFAULT_ROWS_PER_PAGE } from './api.const';

export const getPageAmount = (total: number) => Math.ceil(total / DEFAULT_ROWS_PER_PAGE);
