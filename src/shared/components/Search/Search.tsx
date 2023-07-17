import { ChangeEvent, useEffect } from 'react';
import debounce from 'lodash.debounce';

import { Svg } from 'shared/components/Svg';
import { SEARCH_DEBOUNCE_VALUE } from 'shared/consts';

import { StyledTextField, StyledIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ onSearch, value, setValue, ...props }: SearchProps) => {
  const handleControlledSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setValue?.(searchValue);
  };

  const debounceSearch = debounce((searchValue: string) => {
    onSearch(searchValue);
  }, SEARCH_DEBOUNCE_VALUE);

  const handleUncontrolledSearch = debounce((event: ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  }, SEARCH_DEBOUNCE_VALUE);

  useEffect(() => {
    if (value === undefined || !setValue) return;
    debounceSearch(value);
  }, [value, setValue]);

  return (
    <StyledTextField
      {...props}
      value={value}
      onChange={value !== undefined && setValue ? handleControlledSearch : handleUncontrolledSearch}
      startAdornment={
        <StyledIcon>
          <Svg id="search" />
        </StyledIcon>
      }
    />
  );
};
