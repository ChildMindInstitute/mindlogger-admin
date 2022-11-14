import { ChangeEvent } from 'react';

import { Icon } from 'components/Icon';
import { variables } from 'styles/variables';

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
          <Icon.Search color={variables.palette.shades100_alfa50} />
        </StyledIcon>
      }
    />
  );
};
