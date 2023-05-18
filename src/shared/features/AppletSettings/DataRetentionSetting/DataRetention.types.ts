import { RetentionPeriods } from 'shared/types';

export type DataRetentionFormValues = {
  retentionPeriod: number | undefined;
  retentionType: RetentionPeriods;
};
