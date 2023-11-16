import { Svg } from 'shared/components/Svg';

import { StyledInsertWrapper, StyledInsert } from './InsertItem.styles';
import { InsertItemProps } from './InsertItem.types';

export const InsertItem = ({ isVisible, onInsert, 'data-testid': dataTestid }: InsertItemProps) => {
  if (!isVisible) return null;

  return (
    <StyledInsertWrapper data-testid={dataTestid}>
      <span />
      <StyledInsert onClick={onInsert}>
        <Svg id="add" width={18} height={18} />
      </StyledInsert>
    </StyledInsertWrapper>
  );
};
