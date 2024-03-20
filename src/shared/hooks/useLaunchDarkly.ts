import { LDFlagValue, useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

import { FeatureSegments, FeatureFlags, FeatureFlagsKeys } from 'shared/types/featureFlags';

import { PROHIBITED_PII_KEYS } from './useLaunchDarkly.const';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useLaunchDarkly = () => {
  const ldClient = useLDClient();
  const flags = useFlags();

  const identifyLDContext = (
    context: {
      userId: string;
      workspaceId?: string;
      appletId?: string;
      featureTests?: FeatureSegments[];
    },
    onDone?: ((err: Error | null) => void) | undefined,
  ) => {
    if (PROHIBITED_PII_KEYS.some((val) => Object.keys(context).includes(val))) {
      throw new Error('Context contains prohibited keys');
    }
    ldClient?.identify(
      {
        ...context,
        kind: 'authenticated-users',
        key: `authenticated-users-${context.userId}`,
      },
      undefined,
      onDone,
    );
  };

  /**
   * Resets the active context back to an anonymous user account.
   */
  const resetLDContext = () => {
    ldClient?.identify({
      kind: 'user',
      anonymous: true,
    });
  };

  const featureFlags: () => Partial<Record<FeatureFlags, LDFlagValue>> = () => {
    const keys: FeatureFlags[] = Object.keys(FeatureFlagsKeys) as (keyof typeof FeatureFlagsKeys)[];
    const features: Partial<Record<FeatureFlags, LDFlagValue>> = {};
    keys.forEach((key) => (features[key] = flags[FeatureFlagsKeys[key]]));

    return features;
  };

  return { identifyLDContext, resetLDContext, flags: featureFlags() };
};
