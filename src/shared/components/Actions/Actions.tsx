import { MouseEvent, useState } from 'react';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { concatIf } from 'shared/utils/concatIf';

import { StyledActions, StyledActionButton, StyledActionsWrapper, StyledDotsSvg } from './Actions.styles';
import { Action, ActionsProps } from './Actions.types';

export const Actions = <T = unknown,>({
  items,
  context,
  visibleByDefault = false,
  hasStaticActions,
  sxProps,
  dragHandleProps,
  isDragging,
  'data-testid': dataTestid,
}: ActionsProps<T>) => {
  const [visibleActions, setVisibleActions] = useState(false);

  const onClick = (action: Action<T>['action']) => (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    action(context, event);
  };

  const isVisible = visibleByDefault || visibleActions || Boolean(isDragging);

  return (
    <StyledActionsWrapper
      sx={sxProps}
      onMouseEnter={() => setVisibleActions(true)}
      onMouseLeave={() => setVisibleActions(false)}>
      <StyledActions isVisible={isVisible}>
        {items.map(
          ({
            icon,
            disabled = false,
            action,
            tooltipTitle,
            isDisplayed = true,
            active = false,
            isStatic,
            'data-testid': dataTestid,
          }) => {
            if (!isDisplayed) return null;

            return (
              <Tooltip key={icon.props.id} tooltipTitle={tooltipTitle}>
                <span>
                  <StyledActionButton
                    isActive={active}
                    disabled={disabled}
                    onClick={onClick(action)}
                    onMouseDown={(e) => e.preventDefault()} // prevent onBlur actions for folders
                    isVisible={isVisible || (hasStaticActions && !isVisible && isStatic)}
                    data-testid={dataTestid}>
                    {icon}
                  </StyledActionButton>
                </span>
              </Tooltip>
            );
          },
        )}
        {dragHandleProps && (
          <StyledActionButton
            isVisible={isVisible}
            isActive={false}
            disabled={false}
            data-testid={concatIf(dataTestid, '-dnd')}
            {...dragHandleProps}>
            <Svg id="drag" />
          </StyledActionButton>
        )}
      </StyledActions>
      <StyledDotsSvg
        isVisible={!isVisible}
        id="dots"
        width={18}
        height={4}
        data-testid={concatIf(dataTestid, '-dots')}
      />
    </StyledActionsWrapper>
  );
};
