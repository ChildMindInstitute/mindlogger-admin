import { useEffect, useState } from 'react';
import { Box, Collapse } from '@mui/material';

import { auth, workspaces } from 'redux/modules';
import { checkIfCanAccessData, checkIfCanEdit } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks';

import { EHRBannerActive, EHRBannerAvailable } from '.';

/**
 * Returns a unique key for the EHR banner dismiss state for a given user and workspace, in this
 * format: `ehr-banner-{available/active}-dismissed-{userId}:{workspaceId}`
 */
export const getDismissedKey = (
  userId: string,
  workspaceId: string,
  bannerType: 'available' | 'active',
) => `ehr-banner-${bannerType}-dismissed-${userId}:${workspaceId}`;

export const EHRBanners = () => {
  const { areFeatureFlagsLoaded, ownerId } = workspaces.useData() ?? {};
  const { data: roles } = workspaces.useRolesData();
  const rolesStatus = workspaces.useRolesResponseStatus();
  const { featureFlags } = useFeatureFlags();
  const userData = auth.useData();
  const userId = userData?.user.id;

  const [ehrBanner, setEhrBanner] = useState<'available' | 'active' | null>(null);

  // Need to track collapse state separately so that previously active banner remains visible
  // during collapse transition.
  const [isCollapsing, setIsCollapsing] = useState(false);

  // Once collapse transition is complete, only then update banner state.
  const handleOnExited = () => {
    if (isCollapsing) {
      setEhrBanner(null);
      setIsCollapsing(false);
    }
  };

  useEffect(() => {
    // We have to prevent the banner from showing when feature flags or roles are still being
    // loaded to prevent flickering of undesirable banner states.
    if (!areFeatureFlagsLoaded || rolesStatus === 'loading' || !roles || !userId || !ownerId)
      return;

    // Hide banner if user is in a workspace other than their own and has no roles that allow
    // creating EHR item types or accessing EHR data
    if (
      userId !== ownerId &&
      !Object.values(roles).some((role) => checkIfCanEdit(role) || checkIfCanAccessData(role))
    ) {
      return setEhrBanner(null);
    }

    const availableDismissed = localStorage.getItem(getDismissedKey(userId, ownerId, 'available'));
    const activeDismissed = localStorage.getItem(getDismissedKey(userId, ownerId, 'active'));

    if (featureFlags.enableEhrHealthData === 'available' && !availableDismissed) {
      setEhrBanner('available');
    } else if (featureFlags.enableEhrHealthData === 'active' && !activeDismissed) {
      setEhrBanner('active');
    } else {
      setEhrBanner(null);
    }
  }, [
    areFeatureFlagsLoaded,
    featureFlags.enableEhrHealthData,
    roles,
    userId,
    ownerId,
    rolesStatus,
  ]);

  return userId && ownerId ? (
    <Box>
      <Collapse in={ehrBanner !== null && !isCollapsing} enter={false} onExited={handleOnExited}>
        {ehrBanner === 'available' && (
          <EHRBannerAvailable
            onClose={(reason) => {
              if (reason === 'manual') {
                localStorage.setItem(getDismissedKey(userId, ownerId, 'available'), 'true');
                setIsCollapsing(true);
              }
            }}
          />
        )}
        {ehrBanner === 'active' && (
          <EHRBannerActive
            onClose={(reason) => {
              if (reason === 'manual') {
                localStorage.setItem(getDismissedKey(userId, ownerId, 'active'), 'true');
                setIsCollapsing(true);
              }
            }}
          />
        )}
      </Collapse>
    </Box>
  ) : null;
};
