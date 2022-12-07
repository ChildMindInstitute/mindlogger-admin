import { useState } from 'react';

import {
  StyledActions,
  StyledActionButton,
  StyledSvg,
  StyledActionsWrapper,
} from './Actions.styles';
import { Action } from './Actions.types';

export const Actions = ({ items, context }: { items: Action[]; context: any }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <StyledActionsWrapper
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showActions ? (
        <StyledActions>
          {items.map(({ icon, disabled = false, action }, i) => (
            <StyledActionButton disabled={disabled} key={i} onClick={() => action(context)}>
              {icon}
            </StyledActionButton>
          ))}
        </StyledActions>
      ) : (
        <StyledSvg id="dots" width={18} height={4} />
      )}
    </StyledActionsWrapper>
  );
};
