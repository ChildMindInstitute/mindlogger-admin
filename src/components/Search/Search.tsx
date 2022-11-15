import { ChangeEvent } from 'react';

import { Svg } from 'components/Svg';
import { StyledTextField, StyledIcon } from './Search.styles';

export const Search = ({ placeholder }: { placeholder: string }) => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.value);
  };

  return (
    <StyledTextField
      placeholder={placeholder}
      onChange={handleSearch}
      startAdornment={
        <StyledIcon>
          <Svg id="search" />
        </StyledIcon>
      }
    />
  );
};
