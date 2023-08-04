import { BaseSchema } from 'shared/state';

export type ConfigChanges = {
  hasChanges?: boolean;
  doNotSaveChanges?: boolean;
  saveChanges?: boolean;
} | null;

export type ReportConfigSchema = {
  configChanges: BaseSchema<ConfigChanges>;
};
