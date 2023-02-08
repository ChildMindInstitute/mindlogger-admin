import { ChangeEvent } from 'react';

import { Svg } from 'components';

import { StyledTextField, StyledIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ onSearch, ...props }: SearchProps) => (
  <StyledTextField
    {...props}
    onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
    startAdornment={
      <StyledIcon>
        <Svg id="search" />
      </StyledIcon>
    }
  />
);
