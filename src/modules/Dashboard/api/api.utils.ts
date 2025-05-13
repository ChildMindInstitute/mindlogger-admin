import { DEFAULT_API_RESULTS_PER_PAGE } from './api.const';

export const getExportPageAmount = (total: number) =>
  Math.ceil(total / DEFAULT_API_RESULTS_PER_PAGE);
