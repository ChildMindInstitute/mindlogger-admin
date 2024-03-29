export const DEFAULT_START_DATE = new Date(new Date().setDate(new Date().getDate() - 5));
export const DEFAULT_END_DATE = new Date(new Date().setDate(new Date().getDate() + 1));
export const DEFAULT_START_TIME = '00:00';
export const DEFAULT_END_TIME = '23:59';

export const defaultSummaryFormFiltersValues = {
  startDate: DEFAULT_START_DATE,
  endDate: DEFAULT_END_DATE,
  startTime: DEFAULT_START_TIME,
  endTime: DEFAULT_END_TIME,
  filterByIdentifier: false,
  identifier: [],
  versions: [],
};
