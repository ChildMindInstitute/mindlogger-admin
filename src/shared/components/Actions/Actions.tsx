import { SyntheticEvent, useState } from 'react';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';

import { StyledActions, StyledActionButton, StyledActionsWrapper } from './Actions.styles';
import { Action, ActionsProps } from './Actions.types';

export const Actions = ({ items, context, visibleByDefault = false }: ActionsProps) => {
  const [visibleActions, setVisibleActions] = useState(false);

  const onClick = (action: Action['action']) => (e: SyntheticEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    action(context);
  };

  return (
    <StyledActionsWrapper
      onMouseEnter={() => setVisibleActions(true)}
      onMouseLeave={() => setVisibleActions(false)}
    >
      {visibleByDefault || visibleActions ? (
        <StyledActions>
          {items.map(
            ({
              icon,
              disabled = false,
              action,
              tooltipTitle,
              isDisplayed = true,
              active = false,
            }) =>
              isDisplayed && (
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
              ),
          )}
        </StyledActions>
      ) : (
        <Svg id="dots" width={18} height={4} />
      )}
    </StyledActionsWrapper>
  );
};
