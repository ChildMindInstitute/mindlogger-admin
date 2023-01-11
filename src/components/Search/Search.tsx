import { ChangeEvent } from 'react';

import { Svg } from 'components/Svg';

import { StyledTextField, StyledIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ placeholder, onSearch }: SearchProps) => (
  <StyledTextField
    placeholder={placeholder}
    onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
    startAdornment={
      <StyledIcon>
        <Svg id="search" />
      </StyledIcon>
    }
  />
);
