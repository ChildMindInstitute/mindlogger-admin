import { useEffect, useMemo } from 'react';

import { LinkedTabs } from 'shared/components/Tabs/LinkedTabs';
import { StyledBody } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils/mixpanel';
import { useFeatureFlags } from 'shared/hooks';
import { workspaces } from 'redux/modules';
import { checkIfCanAccessData, checkIfCanEdit, LocalStorageKeys } from 'shared/utils';
import { EHRBannerActive, EHRBannerAvailable } from 'shared/components/Banners/EHRBanners';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  const { areFeatureFlagsLoaded } = workspaces.useData() ?? {};
  const rolesData = workspaces.useRolesData();
  const { featureFlags } = useFeatureFlags();

  // console.log({ areFeatureFlagsLoaded, rolesData });
  const isEhrBannerVisible = useMemo(() => {
    // Do not display banner until workspace is defined, as without this check there can be a flash
    // of banner changes during login
    if (
      !areFeatureFlagsLoaded ||
      !rolesData.data ||
      !Object.values(rolesData.data).some(
        (roles) => checkIfCanEdit(roles) || checkIfCanAccessData(roles),
      )
    ) {
      return {
        available: false,
        active: false,
      };
    }

    return {
      available:
        featureFlags.enableEhrHealthData === 'available' &&
        !localStorage.getItem(LocalStorageKeys.EHRBannerAvailableDismissed),
      active:
        featureFlags.enableEhrHealthData === 'active' &&
        !localStorage.getItem(LocalStorageKeys.EHRBannerActiveDismissed),
    };
  }, [rolesData.data, areFeatureFlagsLoaded, featureFlags.enableEhrHealthData]);

  useEffect(() => {
    Mixpanel.trackPageView('Dashbaord');
  }, []);

  return (
    <StyledBody>
      {isEhrBannerVisible.available && (
        <EHRBannerAvailable
          onClose={(reason) =>
            reason === 'manual' &&
            localStorage.setItem(LocalStorageKeys.EHRBannerAvailableDismissed, 'true')
          }
        />
      )}
      {isEhrBannerVisible.active && (
        <EHRBannerActive
          onClose={(reason) =>
            reason === 'manual' &&
            localStorage.setItem(LocalStorageKeys.EHRBannerActiveDismissed, 'true')
          }
        />
      )}
      <LinkedTabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
