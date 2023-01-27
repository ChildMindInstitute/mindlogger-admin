import { Svg } from 'components/Svg';

import { StyledTextField, StyledIcon, StyledSelectedIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ placeholder, selectedRespondent }: SearchProps) => (
  <StyledTextField
    value={
      selectedRespondent?.id ? `${selectedRespondent.id} (${selectedRespondent?.fullName})` : ''
    }
    placeholder={placeholder}
    startAdornment={
      selectedRespondent?.icon ? (
        <StyledSelectedIcon>{selectedRespondent?.icon}</StyledSelectedIcon>
      ) : null
    }
    endAdornment={
      <StyledIcon>
        <Svg id="search" />
      </StyledIcon>
    }
  />
);
