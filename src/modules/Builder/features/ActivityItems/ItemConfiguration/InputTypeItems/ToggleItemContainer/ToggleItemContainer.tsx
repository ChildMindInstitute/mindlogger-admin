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

export const ToggleItemContainer = ({ title, HeaderContent, Content }: ToggleItemProps) => {
  const [open, setOpen] = useState(true);
  const handleToggle = () => setOpen((prevState) => !prevState);

  return (
    <StyledItemOption>
      <StylesTitleWrapper open={open}>
        <StyledClearedButton onClick={handleToggle}>
          <Svg id={open ? 'navigate-up' : 'navigate-down'} />
        </StyledClearedButton>
        <StyledFlexTopCenter sx={{ m: theme.spacing(0, 5, 0, 3) }}>
          <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
        </StyledFlexTopCenter>
        <HeaderContent open={open} />
      </StylesTitleWrapper>
      {open && <Content />}
    </StyledItemOption>
  );
};
