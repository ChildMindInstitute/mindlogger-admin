import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { SessionStorageKeys } from 'shared/utils';

type BooleanMap = Record<string, boolean>;

export const useDatavizSkippedFilter = (
  defaultValue: boolean = false,
): { hideSkipped: boolean; setSkipped: (skipped: boolean) => void } => {
  const { appletId = '' } = useParams();

  const getInitialState = (): BooleanMap => {
    try {
      const storedValue = sessionStorage.getItem(SessionStorageKeys.DatavizHideSkipped);

      return storedValue ? JSON.parse(storedValue) : {};
    } catch (error) {
      console.warn(
        'Error reading sessionStorage key:',
        SessionStorageKeys.DatavizHideSkipped,
        error,
      );

      return {};
    }
  };
  const [state, setState] = useState<BooleanMap>(getInitialState);
  const formVal: boolean = useWatch({
    name: 'hideSkipped',
    defaultValue: state[appletId] ?? defaultValue,
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(SessionStorageKeys.DatavizHideSkipped, JSON.stringify(state));
    } catch (error) {
      console.error(
        'Error saving to sessionStorage key:',
        SessionStorageKeys.DatavizHideSkipped,
        error,
      );
    }
  }, [state]);

  useEffect(() => {
    if (appletId) {
      setState((prev) => ({
        ...prev,
        [appletId]: formVal,
      }));
    }
  }, [appletId, formVal]);

  const setSkipped = (value: boolean) => {
    if (appletId) {
      setState((prev) => ({
        ...prev,
        [appletId]: value,
      }));
    }
  };

  const hideSkipped = state[appletId] ?? defaultValue;

  return { hideSkipped, setSkipped };
};
