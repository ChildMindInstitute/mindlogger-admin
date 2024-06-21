import { useEffect } from 'react';

import { Workspace } from 'redux/modules';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { useAsync } from 'shared/hooks/useAsync';
import { enableIntegrationApi, disableIntegrationApi, Integration } from 'modules/Dashboard/api';
import {
  FeatureFlagsIntegrationKeys,
  FeatureFlagsIntegrations,
  FeatureFlagsKeys,
} from 'shared/types/featureFlags';

export const useIntegrationToggle = (
  integrationType: FeatureFlagsIntegrationKeys,
  currentWorkspaceData: Workspace | null,
) => {
  const { featureFlags } = useFeatureFlags();
  const { execute: enableIntegration } = useAsync(enableIntegrationApi);
  const { execute: disableIntegration } = useAsync(disableIntegrationApi);

  const integrationFeatureFlagKey = FeatureFlagsIntegrations[
    integrationType
  ] as keyof typeof FeatureFlagsKeys;
  const integrationFeatureFlagValue = featureFlags[integrationFeatureFlagKey];

  useEffect(() => {
    const integration = currentWorkspaceData?.integrations?.find(
      ({ integrationType: type }: Integration) => type === integrationType,
    );

    if (!integration && integrationFeatureFlagValue) {
      enableIntegration([{ integrationType }]);
    } else if (integration && !integrationFeatureFlagValue) {
      disableIntegration([integrationType]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationFeatureFlagValue]);
};
