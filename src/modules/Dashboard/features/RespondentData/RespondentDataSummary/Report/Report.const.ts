import { FilterFormValues } from './Report.types';

export const DEFAULT_START_DATE = new Date(new Date().setDate(new Date().getDate() - 5));
export const DEFAULT_END_DATE = new Date(new Date().setDate(new Date().getDate() + 1));
export const DEFAULT_START_TIME = '00:00';
export const DEFAULT_END_TIME = '23:59';

export const filtersDefaultValues: FilterFormValues = {
  startDateEndDate: [DEFAULT_START_DATE, DEFAULT_END_DATE],
  moreFiltersVisisble: false,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
};
