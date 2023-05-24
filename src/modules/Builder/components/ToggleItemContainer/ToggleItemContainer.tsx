import React, { useState } from 'react';

import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
} from 'shared/styles';
import { Svg } from 'shared/components';

import { StyledItemOption, StylesTitleWrapper } from './ToggleItemContainer.styles';
import { ToggleContainerUiType, ToggleItemProps } from './ToggleItemContainer.types';

export const ToggleItemContainer = ({
  title,
  HeaderContent,
  Content,
  headerContentProps,
  contentProps,
  headerStyles = {},
  uiType = ToggleContainerUiType.Item,
  isOpenByDefault,
}: ToggleItemProps) => {
  const [open, setOpen] = useState(isOpenByDefault ?? true);
  const handleToggle = () => setOpen((prevState) => !prevState);

  return (
    <StyledItemOption uiType={uiType}>
      <StylesTitleWrapper open={open} sx={{ ...headerStyles }}>
        <StyledFlexTopCenter>
          <StyledClearedButton onClick={handleToggle}>
            <Svg id={open ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
          {title && (
            <StyledFlexTopCenter sx={{ m: theme.spacing(0, 5, 0, 3) }}>
              <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
            </StyledFlexTopCenter>
          )}
        </StyledFlexTopCenter>
        {HeaderContent && (
          <HeaderContent open={open} onToggle={handleToggle} {...headerContentProps} />
        )}
      </StylesTitleWrapper>
      {open && <Content {...contentProps} />}
    </StyledItemOption>
  );
};
