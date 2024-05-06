import { useFlags } from 'launchdarkly-react-client-sdk';

import { FeatureFlags, FeatureFlagsKeys } from 'shared/types/featureFlags';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useFeatureFlags = () => {
  const flags = useFlags();

  const featureFlags = () => {
    const keys = Object.keys(FeatureFlagsKeys) as (keyof typeof FeatureFlagsKeys)[];
    const features: FeatureFlags = {};
    keys.forEach((key) => (features[key] = flags[FeatureFlagsKeys[key]]));

    return features;
  };

  return { featureFlags: featureFlags() };
};
