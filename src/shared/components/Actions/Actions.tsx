import { SyntheticEvent, useState } from 'react';
import uniqueId from 'lodash.uniqueid';

import { Tooltip } from 'shared/components/Tooltip';

import {
  StyledActions,
  StyledActionButton,
  StyledActionsWrapper,
  StyledDotsSvg,
} from './Actions.styles';
import { Action, ActionsProps } from './Actions.types';

export const Actions = ({
  items,
  context,
  visibleByDefault = false,
  hasStaticActions,
}: ActionsProps) => {
  const [visibleActions, setVisibleActions] = useState(false);

  const onClick = (action: Action['action']) => (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    action(context);
  };

  const isVisible = visibleByDefault || visibleActions;

  return (
    <StyledActionsWrapper
      onMouseEnter={() => setVisibleActions(true)}
      onMouseLeave={() => setVisibleActions(false)}
    >
      {(isVisible || hasStaticActions) && (
        <StyledActions>
          {items.map(
            ({
              icon,
              disabled = false,
              action,
              tooltipTitle,
              isDisplayed = true,
              active = false,
              isStatic,
            }) => {
              if (!isDisplayed) return null;

              if (hasStaticActions && !isStatic && !isVisible) return null;

              return (
                <Tooltip key={uniqueId()} tooltipTitle={tooltipTitle}>
                  <span>
                    <StyledActionButton
                      isActive={active}
                      disabled={disabled}
                      onClick={onClick(action)}
                    >
                      {icon}
                    </StyledActionButton>
                  </span>
                </Tooltip>
              );
            },
          )}
        </StyledActions>
      )}
      {!isVisible && <StyledDotsSvg id="dots" width={18} height={4} />}
    </StyledActionsWrapper>
  );
};
