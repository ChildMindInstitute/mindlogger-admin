import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Update } from 'history';
import { useLocation, useNavigate } from 'react-router';

import { useBlocker } from './useBlocker';

export type CallbackPromptHookProps = {
  when: boolean;
  handleBlockedNavigation: (nextLocation: Update) => boolean;
  lastLocation: Update | null;
  setLastLocation: Dispatch<SetStateAction<Update | null>>;
  setPromptVisible: Dispatch<SetStateAction<boolean>>;
  confirmedNavigation: boolean;
  setConfirmedNavigation: Dispatch<SetStateAction<boolean>>;
};
export const useCallbackPrompt = ({
  when,
  handleBlockedNavigation,
  lastLocation,
  setLastLocation,
  setPromptVisible,
  confirmedNavigation,
  setConfirmedNavigation,
}: CallbackPromptHookProps) => {
  const navigate = useNavigate();

  const cancelNavigation = () => {
    setPromptVisible(false);
    setLastLocation(null);
  };

  const confirmNavigation = () => {
    setPromptVisible(false);
    setConfirmedNavigation(true);
  };

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.location?.pathname, { state: lastLocation.location?.state });
      setConfirmedNavigation(false);
    }
  }, [confirmedNavigation, lastLocation]);

  useBlocker(handleBlockedNavigation, when);

  return { confirmNavigation, cancelNavigation };
};

export const usePromptSetup = () => {
  const location = useLocation();
  const [promptVisible, setPromptVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Update | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  return {
    location,
    promptVisible,
    setPromptVisible,
    lastLocation,
    setLastLocation,
    confirmedNavigation,
    setConfirmedNavigation,
  };
};
