import { Svg } from 'shared/components';

import { StyledInsertWrapper, StyledInsert } from './InsertItem.styles';
import { InsertItemProps } from './InsertItem.types';

export const InsertItem = ({ isVisible, onInsert }: InsertItemProps) => {
  if (!isVisible) return null;

  return (
    <StyledInsertWrapper>
      <span />
      <StyledInsert onClick={onInsert}>
        <Svg id="add" width={18} height={18} />
      </StyledInsert>
    </StyledInsertWrapper>
  );
};
