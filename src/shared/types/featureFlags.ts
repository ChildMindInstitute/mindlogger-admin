import { LDFlagValue } from 'launchdarkly-react-client-sdk';

// These keys use the camelCase representation of the feature flag value
export const FeatureFlagsKeys = {
  enableItemFlowExtendedItems: 'enableItemFlowExtendedItems',
};

export type FeatureFlags = Partial<Record<keyof typeof FeatureFlagsKeys, LDFlagValue>>;
