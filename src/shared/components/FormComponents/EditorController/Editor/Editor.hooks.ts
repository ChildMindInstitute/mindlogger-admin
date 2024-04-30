import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';

import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import { UseDebounceInputLogicProps } from './Editor.types';

export const useDebounceInputLogic = ({
  value,
  onChange,
  withDebounce,
}: UseDebounceInputLogicProps) => {
  const [inputValue, setInputValue] = useState(value ?? '');
  const focusedRef = useRef(false);
  const shouldSkipDebounceChange = useMemo(
    () => !withDebounce || inputValue === value,
    [inputValue, value, withDebounce],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedChange = useCallback(
    debounce((value: string) => onChange(value), CHANGE_DEBOUNCE_VALUE),
    [],
  );

  const handleChange = useMemo(
    () => (withDebounce ? setInputValue : onChange),
    [onChange, withDebounce],
  );

  const handleBlur = useCallback(() => {
    focusedRef.current = false;
    if (shouldSkipDebounceChange) return;

    handleDebouncedChange.cancel();
    onChange(inputValue);
  }, [shouldSkipDebounceChange, handleDebouncedChange, inputValue, onChange]);

  const handleFocus = useCallback(() => {
    focusedRef.current = true;
  }, []);

  useEffect(() => {
    if (shouldSkipDebounceChange) return;

    handleDebouncedChange(inputValue);
  }, [shouldSkipDebounceChange, inputValue, handleDebouncedChange]);

  useEffect(() => {
    if (focusedRef.current || shouldSkipDebounceChange) return;

    setInputValue(value ?? '');
    handleDebouncedChange.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    inputValue,
    handleChange,
    handleBlur,
    handleFocus,
  };
};
