import { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import { Svg } from 'shared/components/Svg';

import { DEBOUNCE_VALUE } from 'shared/consts';
import { StyledTextField, StyledIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ onSearch, ...props }: SearchProps) => (
  <StyledTextField
    {...props}
    onChange={debounce(
      (event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value),
      DEBOUNCE_VALUE,
    )}
    startAdornment={
      <StyledIcon>
        <Svg id="search" />
      </StyledIcon>
    }
  />
);
