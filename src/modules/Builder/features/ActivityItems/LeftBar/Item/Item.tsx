import { Actions, Svg } from 'shared/components';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { getActions } from './Item.const';
import {
  StyledCol,
  StyledItem,
  StyledDescription,
  StyledTitle,
  StyledActionButton,
} from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({
  id,
  name,
  description,
  icon,
  hidden,
  activeItem,
  setActiveItem,
}: ItemProps) => {
  const hiddenProps = { sx: { opacity: hidden ? 0.38 : 1 } };

  return (
    <StyledItem
      sx={{ backgroundColor: activeItem === id ? variables.palette.secondary_container : '' }}
      onClick={() => setActiveItem(id)}
      hidden={hidden}
    >
      <StyledFlexTopCenter {...hiddenProps}>{icon}</StyledFlexTopCenter>
      <StyledCol {...hiddenProps}>
        <StyledTitle>{name}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
      </StyledCol>
      <div className="actions">
        <Actions items={getActions()} context={{ id }} visibleByDefault />
      </div>
      {hidden && (
        <StyledActionButton>
          <Svg id="visibility-off" />
        </StyledActionButton>
      )}
      <span className="dots">
        <Svg id="dots" />
      </span>
    </StyledItem>
  );
};
