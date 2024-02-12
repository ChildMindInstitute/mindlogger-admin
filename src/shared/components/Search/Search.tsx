import { ChangeEvent, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

import { Svg } from 'shared/components/Svg';
import { SEARCH_DEBOUNCE_VALUE } from 'shared/consts';

import { StyledTextField, StyledIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({
  withDebounce = false,
  value = '',
  onSearch,
  'data-testid': dataTestId,
  ...props
}: SearchProps) => {
  const inputRef = useRef<HTMLInputElement | null>();

  const debouncedHandleChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    onSearch?.(event.target.value);
  }, SEARCH_DEBOUNCE_VALUE);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearch?.(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current?.value === value) return;
    if (inputRef?.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  return (
    <StyledTextField
      {...props}
      onChange={withDebounce ? debouncedHandleChange : handleChange}
      inputRef={inputRef}
      startAdornment={
        <StyledIcon>
          <Svg id="search" height="18" width="18" />
        </StyledIcon>
      }
      data-testid={dataTestId}
    />
  );
};
