import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Update } from 'history';

import { page } from 'resources';
import { useBlocker } from 'shared/hooks';

export const APPLET_LAYER_ROUTES = [
  page.newAppletAbout,
  page.newAppletActivities,
  page.newAppletActivityFlow,
  page.newAppletSettings,
];
export const ACTIVITY_LAYER_ROUTES = [
  page.newAppletNewActivity,
  page.newAppletNewActivityAbout,
  page.newAppletNewActivityItems,
  page.newAppletNewActivityItemFlow,
  page.newAppletNewActivitySettings,
];

export const APPLET_LAYER_REGEXP_ROUTES = APPLET_LAYER_ROUTES.map((route) =>
  route === page.newAppletActivities ? new RegExp(`^${route}$`) : new RegExp(`^${route}.*`),
);
export const ACTIVITY_LAYER_REGEXP_ROUTES = ACTIVITY_LAYER_ROUTES.map(
  (route) => new RegExp(`^${route}.*`),
);

export const isAppletRoute = (path: string) =>
  APPLET_LAYER_REGEXP_ROUTES.some((route) => route.test(path));
export const isActivityRoute = (path: string) =>
  ACTIVITY_LAYER_REGEXP_ROUTES.some((route) => route.test(path));

export const usePrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [promptVisible, setPromptVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Update | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setPromptVisible(false);
    setLastLocation(null);
  }, []);

  // handle blocking when user click on another route prompt will be shown
  const handleBlockedNavigation = useCallback(
    (nextLocation: Update) => {
      const currentPathname = location.pathname;
      const nextPathname = nextLocation.location.pathname;
      const shouldSkip =
        (isAppletRoute(currentPathname) && isAppletRoute(nextPathname)) ||
        (isActivityRoute(currentPathname) && isActivityRoute(nextPathname));

      if (!confirmedNavigation && !shouldSkip) {
        setPromptVisible(true);
        setLastLocation(nextLocation);

        return false;
      }

      setLastLocation(nextLocation);
      setConfirmedNavigation(true);

      return true;
    },
    [confirmedNavigation, location],
  );

  const confirmNavigation = useCallback(() => {
    setPromptVisible(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location?.pathname);
      setConfirmedNavigation(false);
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, true);

  return { promptVisible, confirmNavigation, cancelNavigation };
};
