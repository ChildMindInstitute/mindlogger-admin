import { useState } from 'react';

import { Svg, Tooltip } from 'components';

import { StyledActions, StyledActionButton, StyledActionsWrapper } from './Actions.styles';
import { ActionsProps } from './Actions.types';

export const Actions = ({ items, context }: ActionsProps) => {
  const [visibleActions, setVisibleActions] = useState(false);

  return (
    <StyledActionsWrapper
      onMouseEnter={() => setVisibleActions(true)}
      onMouseLeave={() => setVisibleActions(false)}
    >
      {visibleActions ? (
        <StyledActions>
          {items.map(
            ({ icon, disabled = false, action, tooltipTitle, isDisplayed = true }, i) =>
              isDisplayed && (
                <Tooltip key={i} tooltipTitle={tooltipTitle}>
                  <span>
                    <StyledActionButton disabled={disabled} onClick={() => action(context)}>
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
