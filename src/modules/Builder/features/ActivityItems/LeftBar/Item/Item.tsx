import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWatch } from 'react-hook-form';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { Actions } from 'shared/components';
import { StyledFlexTopCenter, variables } from 'shared/styles';
import { itemsTypeIcons } from 'shared/consts';
import { falseReturnFunc, getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { ItemFormValues, ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';
import { removeMarkdown } from 'modules/Builder/utils';

import { StyledCol, StyledDescription, StyledItem, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';
import { getActions } from './Item.utils';
import { getItemConditionDependencies } from '../../ActivityItems.utils';

export const Item = ({
  name,
  index,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
  onChangeItemVisibility,
  dragHandleProps,
  isDragging = false,
  'data-testid': dataTestid,
}: ItemProps) => {
  const { itemId } = useParams();
  const { getFieldState } = useCustomFormContext();
  const [visibleActions, setVisibleActions] = useState(false);
  const { activity } = useCurrentActivity();
  const item: ItemFormValues = useWatch({ name: name! });

  const hasHiddenOption = !!getItemConditionDependencies(item, activity?.conditionalLogic)?.length;
  const isItemHidden = name ? item?.isHidden : false;

  const actionsSxProps = {
    justifyContent: 'flex-end',
    pointerEvents: isDragging ? 'none' : 'auto',
    width: 'auto',
  };

  const actions = getActions({
    onRemoveItem,
    onDuplicateItem,
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
      data-testid={dataTestid}
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
