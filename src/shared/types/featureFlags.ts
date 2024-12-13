import { LDFlagValue } from 'launchdarkly-react-client-sdk';

// These keys use the camelCase representation of the feature flag value
// e.g. enable-participant-multi-informant in LaunchDarky becomes enableParticipantMultiInformant
export const FeatureFlagsKeys = {
  enableParticipantMultiInformant: 'enableParticipantMultiInformant',
  // TODO: https://mindlogger.atlassian.net/browse/M2-6519 Activity Filter Sort flag cleanup
  enableActivityFilterSort: 'enableActivityFilterSort',
  // TODO: https://mindlogger.atlassian.net/browse/M2-6518 Assign Activity flag cleanup
  enableActivityAssign: 'enableActivityAssign',
  // TODO: https://mindlogger.atlassian.net/browse/M2-6523 Participant Connections flag cleanup
  enableParticipantConnections: 'enableParticipantConnections',
  enableLorisIntegration: 'enableLorisIntegration',
  enableProlificIntegration: 'enableProlificIntegration',
  enableItemFlowExtendedItems: 'enableItemFlowExtendedItems',
  enableParagraphTextItem: 'enableParagraphTextItem',
  enablePhrasalTemplate: 'enablePhrasalTemplate',
  enableShareToLibrary: 'enableShareToLibrary',
  enableDataExportSpeedUp: 'enableDataExportSpeedUp',
  enableMeritActivityType: 'enableMeritActivityType',
  enableCahmiSubscaleScoring: 'enableCahmiSubscaleScoring',
};

export type FeatureFlags = Partial<Record<keyof typeof FeatureFlagsKeys, LDFlagValue>>;
