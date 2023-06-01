import { Svg } from 'shared/components';
import { getRespondentName } from 'shared/utils';

import { StyledTextField, StyledIcon, StyledSelectedIcon } from './Search.styles';
import { SearchProps } from './Search.types';

export const Search = ({ placeholder, selectedRespondent }: SearchProps) => {
  const { id, icon, nickname, secretId } = selectedRespondent || {};
  const getSearchValue = () => {
    if (!id || !secretId) return '';

    return getRespondentName(secretId, nickname);
  };

  return (
    <StyledTextField
      value={getSearchValue()}
      placeholder={placeholder}
      startAdornment={icon ? <StyledSelectedIcon>{icon}</StyledSelectedIcon> : null}
      inputProps={{
        readOnly: true,
      }}
      endAdornment={
        <StyledIcon>
          <Svg id="search" />
        </StyledIcon>
      }
    />
  );
};
