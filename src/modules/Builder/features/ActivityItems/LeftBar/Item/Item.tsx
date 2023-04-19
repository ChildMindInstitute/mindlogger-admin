import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Actions } from 'shared/components';
import { itemsTypeIcons } from 'shared/consts';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { getActions } from './Item.utils';
import { StyledCol, StyledItem, StyledDescription, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';
import { getItemKey } from '../../ActivityItems.utils';

export const Item = ({
  item,
  name,
  index,
  activeItemId,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
  dragHandleProps,
  isDragging,
}: ItemProps) => {
  const { setValue, watch, getFieldState } = useFormContext();
  const [visibleActions, setVisibleActions] = useState(false);

  const isItemHidden = watch(`${name}.isHidden`);
  const hiddenProps = { sx: { opacity: isItemHidden ? 0.38 : 1 } };

  const { invalid: invalidField } = getFieldState(name);

  const onChangeVisibility = () => setValue(`${name}.isHidden`, !isItemHidden);

  return (
    <StyledItem
      isActive={activeItemId === getItemKey(item)}
      hasError={invalidField}
      onClick={() => onSetActiveItem(getItemKey(item) ?? '')}
      onMouseLeave={() => setVisibleActions(false)}
      onMouseEnter={() => setVisibleActions(true)}
      isDragging={isDragging}
    >
      <StyledFlexTopCenter {...hiddenProps}>
        {item.responseType ? itemsTypeIcons[item.responseType] : ''}
      </StyledFlexTopCenter>
      <StyledCol {...hiddenProps}>
        <StyledTitle>{item.name}</StyledTitle>
        <StyledDescription>{item.question}</StyledDescription>
      </StyledCol>
      <Actions
        items={getActions({
          onRemoveItem,
          onDuplicateItem: () => onDuplicateItem(index),
          onChangeVisibility,
          isItemHidden,
        })}
        context={getItemKey(item)}
        visibleByDefault={visibleActions}
        sxProps={{ justifyContent: 'flex-end', pointerEvents: isDragging ? 'none' : 'auto' }}
        dragHandleProps={dragHandleProps}
        isDragging={isDragging}
        hasStaticActions={isItemHidden}
      />
    </StyledItem>
  );
};
