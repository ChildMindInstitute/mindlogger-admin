export enum MixProperties {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  SourceAccountType = 'Source Account Type',
  TargetAccountType = 'Target Account Type',
  InputAccountType = 'Input Account Type',
  IsSelfReporting = 'Is Self Reporting',
  Tag = 'Tag',
  Via = 'Via',
}

export type MixPayload = Partial<Record<MixProperties, unknown>>;
