import { LDFlagValue } from 'launchdarkly-react-client-sdk';

// These keys use the camelCase representation of the feature flag value
// e.g. enable-multi-informant in LaunchDarky becomes enableMultiInformant
export const FeatureFlagsKeys = {
  enableMultiInformant: 'enableMultiInformant',
  enableMultiInformantTakeNow: 'enableMultiInformantTakeNow',
};

export type FeatureFlags = Partial<Record<keyof typeof FeatureFlagsKeys, LDFlagValue>>;
