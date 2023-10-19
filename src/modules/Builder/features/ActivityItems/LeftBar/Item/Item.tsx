import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Actions } from 'shared/components';
import { StyledFlexTopCenter, StyledObserverTarget, variables } from 'shared/styles';
import { itemsTypeIcons } from 'shared/consts';
import { falseReturnFunc, getEntityKey, removeMarkdown } from 'shared/utils';
import { useIntersectionObserver } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';

import { StyledCol, StyledItem, StyledDescription, StyledTitle } from './Item.styles';
import { ItemProps } from './Item.types';
import { getSummaryRowDependencies } from '../../ActivityItems.utils';
import { getActions, getObserverSelector } from './Item.utils';
import { StaticItem } from './StaticItem';

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
  const { setValue, getFieldState } = useFormContext();
  const [visibleActions, setVisibleActions] = useState(false);
  const [isStatic, setStatic] = useState(true);
  const { activity } = useCurrentActivity();

  useIntersectionObserver({
    targetSelector: `.${getObserverSelector(index)}`,
    onAppear: () => setStatic(false),
    onHide: () => setStatic(true),
  });

  const hasHiddenOption = !!getSummaryRowDependencies(item, activity?.conditionalLogic)?.length;
  const isItemHidden = !!item?.isHidden;

  const onChangeVisibility = name
    ? () => setValue(`${name}.isHidden`, !isItemHidden)
    : falseReturnFunc;

  const actionsSxProps = {
    justifyContent: 'flex-end',
    pointerEvents: isDragging ? 'none' : 'auto',
    width: 'auto',
  };
  const actions = getActions({
    onRemoveItem,
    onDuplicateItem: () => onDuplicateItem(index!),
    onChangeVisibility,
    isItemHidden,
    hasHiddenOption,
    'data-testid': `builder-activity-items-item-${index}`,
  });

  if (isStatic)
    return (
      <StyledItem isActive={false} hasError={false} isDragging={false} isSystem={false}>
        <StyledObserverTarget className={getObserverSelector(index)} />
        <StaticItem />
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

  const isActive = activeItemId === getEntityKey(item);
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
      <StyledObserverTarget className={getObserverSelector(index)} />
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
