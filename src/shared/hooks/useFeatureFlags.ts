import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

import { FeatureFlagDefaults } from 'shared/hooks/useFeatureFlags.const';
import { FeatureFlags } from 'shared/types/featureFlags';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useFeatureFlags = () => {
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
    const keys = Object.keys(FeatureFlagDefaults) as (keyof typeof FeatureFlagDefaults)[];
    const features: FeatureFlags = {};
    keys.forEach((key) => (features[key] = flags[key] ?? FeatureFlagDefaults[key]));

    return features;
  };

  return { resetLDContext, featureFlags: featureFlags() };
};
