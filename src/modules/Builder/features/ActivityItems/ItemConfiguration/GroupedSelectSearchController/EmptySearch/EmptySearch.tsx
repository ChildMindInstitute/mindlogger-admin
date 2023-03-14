import { Svg } from 'shared/components';
import { StyledTitleLarge, variables } from 'shared/styles';

import { EmptySearchProps } from './EmptySearch.types';
import { StyledEmptyTable, StyledIcon } from './EmptySearch.styles';

export const EmptySearch = ({ description }: EmptySearchProps) => (
  <StyledEmptyTable>
    <StyledIcon>
      <Svg width="64" height="64" id="not-found" />
    </StyledIcon>
    <StyledTitleLarge color={variables.palette.secondary60}>{description}</StyledTitleLarge>
  </StyledEmptyTable>
);
