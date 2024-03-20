import { LDFlagValue } from 'launchdarkly-react-client-sdk';

// These keys use the camelCase representation of the feature flag value
// e.g. multi-informant-feature-flag in LaunchDarky becomes multiInformantFeatureFlag
export const FeatureFlagsKeys = {
  multiInformantFlag: 'multiInformantFeatureFlag',
};

export type FeatureFlags = Partial<Record<keyof typeof FeatureFlagsKeys, LDFlagValue>>;

export const enum FeatureSegments {
  MultiInformantSegment = 'multi-informant',
}
