export const enum DateRangePickerType {
  AllTime = 'allTime',
  Last24h = 'last24h',
  LastWeek = 'lastWeek',
  LastMonth = 'lastMonth',
  ChooseDates = 'chooseDates',
}

export type DateRangePickerFormValues = {
  dateType: DateRangePickerType;
  fromDate: Date;
  toDate: Date;
};
