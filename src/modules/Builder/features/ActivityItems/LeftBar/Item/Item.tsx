import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFormContext, useWatch } from 'react-hook-form';

import { Actions } from 'shared/components';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { itemsTypeIcons } from 'shared/consts';
import { falseReturnFunc, getEntityKey, removeMarkdown } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { ItemFormValues, ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { StyledCol, StyledDescription, StyledItem, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';
import { getSummaryRowDependencies } from '../../ActivityItems.utils';
import { getActions } from './Item.utils';

export const Item = ({
  name,
  index,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
  onChangeItemVisibility,
  dragHandleProps,
  isDragging = false,
}: ItemProps) => {
  const { itemId } = useParams();
  const { getFieldState } = useFormContext();
  const [visibleActions, setVisibleActions] = useState(false);
  const { activity } = useCurrentActivity();
  const item: ItemFormValues = useWatch({ name: name! });

  const hasHiddenOption = !!getSummaryRowDependencies(item, activity?.conditionalLogic)?.length;
  const isItemHidden = !!item?.isHidden;

  const actionsSxProps = {
    justifyContent: 'flex-end',
    pointerEvents: isDragging ? 'none' : 'auto',
    width: 'auto',
  };

  const actions = getActions({
    onRemoveItem,
    onDuplicateItem: () => onDuplicateItem(index!),
    onChangeVisibility: () => onChangeItemVisibility?.(),
    isItemHidden,
    hasHiddenOption,
    'data-testid': `builder-activity-items-item-${index}`,
  });

  const isActive = itemId === getEntityKey(item);
  const hiddenProps = { sx: { opacity: isItemHidden ? variables.opacity.disabled : 1 } };
  const invalidField = name ? !!getFieldState(name).error : false;

  const handleItemClick = item.allowEdit ? () => onSetActiveItem(item) : falseReturnFunc;

  return (
    <StyledItem
      isActive={isActive}
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
        <StyledDescription>{removeMarkdown(item.question)}</StyledDescription>
      </StyledCol>
      {item.allowEdit && (
        <Actions
          items={actions}
          context={getEntityKey(item)}
          visibleByDefault={visibleActions}
          sxProps={actionsSxProps}
          dragHandleProps={dragHandleProps}
          isDragging={isDragging}
          hasStaticActions={isItemHidden}
          data-testid={`builder-activity-items-item-${index}`}
        />
      )}
    </StyledItem>
  );
};
