import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { useBlocker } from 'react-router-dom';
import type { Update } from 'history';

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
  setLastLocation,
  setPromptVisible,
  setConfirmedNavigation,
}: CallbackPromptHookProps) => {
  // Use React Router v6's useBlocker instead of the legacy history.block() approach.
  // history.block() tried to undo POP (browser back/forward) events via
  // window.history.go(), but Chrome 90+ executes that call asynchronously.
  // The page briefly navigated away, unmounting the component before the block
  // callback could show the prompt. RR6's useBlocker intercepts navigation before
  // it commits, so the component stays mounted and POP events are reliably blocked.
  const handleRef = useRef(handleBlockedNavigation);
  handleRef.current = handleBlockedNavigation;

  const blocker = useBlocker(useCallback(() => when, [when]));

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    // Build a synthetic Update compatible with handleBlockedNavigation's signature.
    // Callers only read location.pathname and location.state; action is unused.
    // retry() maps to blocker.proceed() so shouldSkip branches can allow navigation.
    const syntheticUpdate = {
      location: blocker.location,
      retry: () => blocker.proceed?.(),
    } as unknown as Update;

    handleRef.current(syntheticUpdate);
  }, [blocker.state, blocker.location]);

  const confirmNavigation = () => {
    setPromptVisible(false);
    setConfirmedNavigation(true);
    // proceed() commits the original blocked navigation directly, replacing the
    // old pattern of navigate(lastLocation) triggered by setConfirmedNavigation.
    blocker.proceed?.();
  };

  const cancelNavigation = () => {
    setPromptVisible(false);
    setLastLocation(null);
    blocker.reset?.();
  };

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
