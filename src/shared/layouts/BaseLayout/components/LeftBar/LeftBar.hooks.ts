import { useEffect } from 'react';
import { LDFlagSet } from 'launchdarkly-react-client-sdk';

import { Workspace, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { useAsync } from 'shared/hooks/useAsync';
import { enableIntegrationApi, disableIntegrationApi, Integration } from 'modules/Dashboard/api';
import { FeatureFlagsIntegrationKeys, FeatureFlagsIntegrations } from 'shared/types/featureFlags';

export const useIntegrationToggle = ({
  integrationType,
  currentWorkspaceData,
  areFeatureFlagsLoaded,
  featureFlags,
}: {
  integrationType: FeatureFlagsIntegrationKeys;
  currentWorkspaceData: Workspace | null;
  areFeatureFlagsLoaded: boolean;
  featureFlags?: LDFlagSet;
}) => {
  const dispatch = useAppDispatch();
  const { getWorkspaces } = workspaces.thunk;

  const { execute: enableIntegration } = useAsync(enableIntegrationApi, () => {
    dispatch(getWorkspaces());
  });
  const { execute: disableIntegration } = useAsync(disableIntegrationApi, () => {
    dispatch(getWorkspaces());
  });

  const integrationFeatureFlagKey = FeatureFlagsIntegrations[integrationType];
  const integrationFeatureFlagValue = featureFlags?.[integrationFeatureFlagKey];

  useEffect(() => {
    if (!currentWorkspaceData || !areFeatureFlagsLoaded) return;

    const integration = currentWorkspaceData?.integrations?.find(
      ({ integrationType: type }: Integration) =>
        type.toLowerCase() === integrationType.toLowerCase(),
    );

    if (!integration && integrationFeatureFlagValue) {
      enableIntegration([{ integrationType }]);
    } else if (integration && !integrationFeatureFlagValue) {
      disableIntegration([integrationType]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    areFeatureFlagsLoaded,
    featureFlags,
    integrationFeatureFlagValue,
    currentWorkspaceData?.integrations,
  ]);
};
