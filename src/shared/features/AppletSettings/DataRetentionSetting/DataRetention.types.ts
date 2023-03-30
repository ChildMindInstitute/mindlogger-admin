export const enum Periods {
  Indefinitely = 'indefinitely',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export type DataRetentionFormValues = {
  period: Periods;
  periodNumber: number;
};
