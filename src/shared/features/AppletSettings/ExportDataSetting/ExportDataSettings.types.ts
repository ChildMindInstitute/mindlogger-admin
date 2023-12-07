export const enum ExportDateType {
  AllTime = 'allTime',
  Last24h = 'last24h',
  LastWeek = 'lastWeek',
  LastMonth = 'lastMonth',
  ChooseDates = 'chooseDates',
}

export type ExportDataFormValues = {
  dateType: ExportDateType;
  fromDate: Date;
  toDate: Date;
};
