import { useState } from 'react';

import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { StyledActions, StyledActionButton, StyledSvg } from './Actions.styles';
import { Action } from './Actions.types';

export const Actions = ({ items, context }: { items: Action[]; context: any }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <StyledFlexTopCenter>
      <StyledSvg
        id="dots"
        width={18}
        height={4}
        onMouseEnter={() => setShowActions(!showActions)}
      />
      {showActions && (
        <StyledActions>
          {items.map(({ icon, action }, i) => (
            <StyledActionButton key={i} onClick={() => action(context)}>
              {icon}
            </StyledActionButton>
          ))}
        </StyledActions>
      )}
    </StyledFlexTopCenter>
  );
};
