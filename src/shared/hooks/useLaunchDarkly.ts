import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

import { FeatureFlags, FeatureFlagsKeys } from 'shared/types/featureFlags';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useLaunchDarkly = () => {
  const ldClient = useLDClient();
  const flags = useFlags();

  /**
   * Resets the active context back to an anonymous user account.
   */
  const resetLDContext = () => {
    ldClient?.identify({
      kind: 'user',
      anonymous: true,
    });
  };

  const featureFlags = () => {
    const keys = Object.keys(FeatureFlagsKeys) as (keyof typeof FeatureFlagsKeys)[];
    const features: FeatureFlags = {};
    keys.forEach((key) => (features[key] = flags[FeatureFlagsKeys[key]]));

    return features;
  };

  return { resetLDContext, flags: featureFlags() };
};
