import { SaveAndPublishSteps } from './SaveAndPublishProcessPopup.types';

export const saveAndPublishProcessTestIds = {
  [SaveAndPublishSteps.AtLeastOneActivity]: '-empty-activities',
  [SaveAndPublishSteps.AtLeastOneItem]: '-empty-activity-items',
  [SaveAndPublishSteps.EmptyRequiredFields]: '-empty-required-fields',
  [SaveAndPublishSteps.ErrorsInFields]: '-errors-in-fields',
  [SaveAndPublishSteps.BeingCreated]: '-loading',
  [SaveAndPublishSteps.Failed]: '-failed',
  [SaveAndPublishSteps.NoPermission]: '-no-permission',
  [SaveAndPublishSteps.ReportConfigSave]: '-report-config-save-changes',
};
