// These keys use the camelCase representation of the feature flag value
// e.g. enable-participant-multi-informant in LaunchDarky becomes enableParticipantMultiInformant
export type FeatureFlags = Partial<{
  enableParticipantMultiInformant: boolean;
  // TODO: https://mindlogger.atlassian.net/browse/M2-6519 Activity Filter Sort flag cleanup
  enableActivityFilterSort: boolean;
  // TODO: https://mindlogger.atlassian.net/browse/M2-6518 Assign Activity flag cleanup
  enableActivityAssign: boolean;
  // TODO: https://mindlogger.atlassian.net/browse/M2-6523 Participant Connections flag cleanup
  enableParticipantConnections: boolean;
  enableLorisIntegration: boolean;
  enableProlificIntegration: boolean;
  enableItemFlowExtendedItems: boolean;
  enableItemFlowItemsG2: boolean;
  enableItemFlowItemsG3: boolean;
  enableParagraphTextItem: boolean;
  enablePhrasalTemplate: boolean;
  enableShareToLibrary: boolean;
  enableDataExportSpeedUp: boolean;
  enableMeritActivityType: boolean;
  enableCahmiSubscaleScoring: boolean;
  enableDataExportRenaming: boolean;
  enableSubscaleNullWhenSkipped: boolean;
  enableEhrHealthData: 'unavailable' | 'available' | 'active';
}>;
