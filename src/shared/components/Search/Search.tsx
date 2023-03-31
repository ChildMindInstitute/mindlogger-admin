import { ChangeEvent } from 'react';
import debounce from 'lodash.debounce';

import { Svg } from 'shared/components/Svg';

import { StyledTextField, StyledIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ onSearch, ...props }: SearchProps) => (
  <StyledTextField
    {...props}
    onChange={debounce((event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value), 700)}
    startAdornment={
      <StyledIcon>
        <Svg id="search" />
      </StyledIcon>
    }
  />
);
