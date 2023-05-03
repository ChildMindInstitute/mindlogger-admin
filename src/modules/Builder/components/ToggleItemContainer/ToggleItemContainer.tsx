import React, { useState } from 'react';

import {
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
} from 'shared/styles';
import { Svg } from 'shared/components';

import { StyledItemOption, StylesTitleWrapper } from './ToggleItemContainer.styles';
import { ToggleItemProps } from './ToggleItemContainer.types';

export const ToggleItemContainer = ({
  title,
  HeaderContent,
  Content,
  headerContentProps,
  contentProps,
  headerStyles = {},
}: ToggleItemProps) => {
  const [open, setOpen] = useState(true);
  const handleToggle = () => setOpen((prevState) => !prevState);

  return (
    <StyledItemOption>
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
        <HeaderContent open={open} {...headerContentProps} />
      </StylesTitleWrapper>
      {open && <Content {...contentProps} />}
    </StyledItemOption>
  );
};
