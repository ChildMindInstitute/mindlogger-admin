import { Svg } from 'shared/components/Svg';
import { StyledTitleLarge, variables } from 'shared/styles';

import { EmptySearchProps } from './EmptySearch.types';
import { StyledEmptyItem, StyledIcon } from './EmptySearch.styles';

export const EmptySearch = ({ description, 'data-testid': dataTestid }: EmptySearchProps) => (
  <StyledEmptyItem data-testid={dataTestid}>
    <StyledIcon>
      <Svg width="64" height="64" id="not-found" />
    </StyledIcon>
    <StyledTitleLarge sx={{ maxWidth: '40rem' }} color={variables.palette.secondary60}>
      {description}
    </StyledTitleLarge>
  </StyledEmptyItem>
);
