import { LDFlagValue } from 'launchdarkly-react-client-sdk';

// These keys use the camelCase representation of the feature flag value
// e.g. enable-multi-informant in LaunchDarky becomes enableMultiInformant
export const FeatureFlagsKeys = {
  multiInformantFlag: 'enableMultiInformant',
};

export type FeatureFlags = Partial<Record<keyof typeof FeatureFlagsKeys, LDFlagValue>>;

export const enum FeatureSegments {
  MultiInformantSegment = 'multi-informant',
}
