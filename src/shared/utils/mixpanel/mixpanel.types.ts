export enum MixpanelProps {
  Feature = 'Feature',
  AppletId = 'Applet ID',
  ActivityId = 'Activity ID',
  ActivityFlowId = 'Activity Flow ID',
  MultiInformantAssessmentId = 'Multi-informant Assessment ID',
  SourceAccountType = 'Source Account Type',
  TargetAccountType = 'Target Account Type',
  InputAccountType = 'Input Account Type',
  IsSelfReporting = 'Is Self Reporting',
  Roles = 'Roles',
  Tag = 'Tag',
  Via = 'Via',
}

export type MixpanelPayload = Partial<Record<MixpanelProps, unknown>>;
