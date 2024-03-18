import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

import { FeatureSegments } from 'shared/types/featureFlags';

const omitKeys = ['firstName', 'lastName', 'email'];

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
    if (omitKeys.some((val) => Object.keys(context).includes(val))) {
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

  return { identifyLDContext, resetLDContext, flags };
};
