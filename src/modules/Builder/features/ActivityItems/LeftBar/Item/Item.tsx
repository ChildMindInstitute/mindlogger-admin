import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Actions } from 'shared/components';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { itemsTypeIcons } from 'shared/consts';
import { falseReturnFunc, getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { getActions } from './Item.utils';
import { StyledCol, StyledItem, StyledDescription, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';
import { getSummaryRowDependencies } from '../../ActivityItems.utils';

export const Item = ({
  item,
  name,
  index,
  activeItemId,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
  dragHandleProps,
  isDragging = false,
}: ItemProps) => {
  const { setValue, watch, getFieldState } = useFormContext();
  const [visibleActions, setVisibleActions] = useState(false);
  const { activity } = useCurrentActivity();

  const hasHiddenOption = !!getSummaryRowDependencies(item, activity?.conditionalLogic)?.length;
  const isItemHidden = name ? watch(`${name}.isHidden`) : false;
  const hiddenProps = { sx: { opacity: isItemHidden ? variables.opacity.disabled : 1 } };
  const invalidField = name ? !!getFieldState(name).error : false;

  const onChangeVisibility = name
    ? () => setValue(`${name}.isHidden`, !isItemHidden)
    : falseReturnFunc;

  const handleItemClick = item.allowEdit
    ? () => onSetActiveItem(getEntityKey(item) ?? '')
    : falseReturnFunc;

  return (
    <StyledItem
      isActive={activeItemId === getEntityKey(item)}
      hasError={invalidField}
      onClick={handleItemClick}
      onMouseLeave={() => setVisibleActions(false)}
      onMouseEnter={() => setVisibleActions(true)}
      isDragging={isDragging}
      isSystem={!item.allowEdit}
    >
      <StyledFlexTopCenter {...hiddenProps}>
        {item.responseType ? itemsTypeIcons[item.responseType as ItemResponseTypeNoPerfTasks] : ''}
      </StyledFlexTopCenter>
      <StyledCol {...hiddenProps}>
        <StyledTitle>{item.name}</StyledTitle>
        <StyledDescription>{item.question}</StyledDescription>
      </StyledCol>
      {item.allowEdit && (
        <Actions
          items={getActions({
            onRemoveItem,
            onDuplicateItem: () => onDuplicateItem(index!),
            onChangeVisibility,
            isItemHidden,
            hasHiddenOption,
            'data-testid': `builder-activity-items-item-${index}`,
          })}
          context={getEntityKey(item)}
          visibleByDefault={visibleActions}
          sxProps={{ justifyContent: 'flex-end', pointerEvents: isDragging ? 'none' : 'auto' }}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          hasStaticActions={isItemHidden}
          data-testid={`builder-activity-items-item-${index}`}
        />
      )}
    </StyledItem>
  );
};
