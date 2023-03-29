import { Actions, Svg } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { getActions } from './Item.const';
import {
  StyledCol,
  StyledItem,
  StyledDescription,
  StyledTitle,
  StyledActionButton,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { itemsTypeIcons } from '../../ActivityItems.const';

export const Item = ({
  id,
  name,
  body,
  itemsInputType,
  hidden,
  activeItemId,
  onSetActiveItem,
  onRemoveItem,
}: ItemProps) => {
  const hiddenProps = { sx: { opacity: hidden ? 0.38 : 1 } };

  return (
    <StyledItem
      sx={{ backgroundColor: activeItemId === id ? variables.palette.secondary_container : '' }}
      onClick={() => onSetActiveItem(activeItemId === id ? '' : id)}
      hidden={hidden}
    >
      <StyledFlexTopCenter {...hiddenProps}>
        {itemsInputType ? itemsTypeIcons[itemsInputType] : ''}
      </StyledFlexTopCenter>
      <StyledCol {...hiddenProps}>
        <StyledTitle>{name}</StyledTitle>
        <StyledDescription>{body}</StyledDescription>
      </StyledCol>
      <div className="actions">
        <Actions items={getActions({ onRemoveItem })} context={id} visibleByDefault />
      </div>
      {hidden && (
        <StyledActionButton>
          <Svg id="visibility-off" />
        </StyledActionButton>
      )}
      <span className="dots">
        <Svg id="dots" />
      </span>
    </StyledItem>
  );
};
