import { ChangeEvent } from 'react';

import { Svg } from 'components/Svg';
import { StyledTextField, StyledIcon } from './Search.styles';

export const Search = ({
  placeholder,
  onSearch,
}: {
  placeholder: string;
  onSearch: (value: string) => void;
}) => (
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
