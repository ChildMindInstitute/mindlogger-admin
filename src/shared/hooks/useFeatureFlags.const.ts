import { FeatureFlags } from 'shared/types/featureFlags';

export const FeatureFlagDefaults: FeatureFlags = {
  enableSubscaleNullWhenSkipped: false,
  enableParticipantMultiInformant: false,
  enableActivityFilterSort: false,
  enableActivityAssign: false,
  enableParticipantConnections: false,
  enableLorisIntegration: false,
  enableProlificIntegration: false,
  enableItemFlowExtendedItems: false,
  enableItemFlowItemsG2: false,
  enableItemFlowItemsG3: false,
  enableParagraphTextItem: false,
  enablePhrasalTemplate: false,
  enableShareToLibrary: false,
  enableDataExportSpeedUp: false,
  enableMeritActivityType: false,
  enableCahmiSubscaleScoring: false,
  enableDataExportRenaming: false,
  enableEhrHealthData: 'unavailable',
  enableEmaExtraFiles: false,
};

export const PROHIBITED_PII_KEYS = ['firstName', 'lastName', 'email'];
