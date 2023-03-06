import { useState } from 'react';
import uniqueId from 'lodash.uniqueid';

import { Svg, Tooltip } from 'components';
import { StyledLabelBoldLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import {
  StyledChildren,
  StyledCollapseBtn,
  StyledCollapse,
  StyledItem,
  StyledIconBtn,
} from './ExpandedList.styles';
import { ExpandedListProps } from './ExpandedList.types';

export const ExpandedList = ({ title, items, buttons }: ExpandedListProps) => {
  const [listVisible, setListVisible] = useState(true);

  return (
    <StyledCollapse>
      <StyledCollapseBtn onClick={() => setListVisible((prevState) => !prevState)}>
        <Svg id={listVisible ? 'navigate-up' : 'navigate-down'} />
        <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(1) }}>{title}</StyledLabelBoldLarge>
        {buttons?.map((el, i) => (
          <Tooltip tooltipTitle={el.tooltipTitle} key={uniqueId()}>
            <StyledIconBtn
              sx={{ marginLeft: i === 0 ? 'auto' : theme.spacing(0.4) }}
              onClick={(e) => {
                e.stopPropagation();
                el.action();
              }}
            >
              {el.icon}
            </StyledIconBtn>
          </Tooltip>
        ))}
      </StyledCollapseBtn>
      {listVisible && (
        <StyledChildren>
          {items?.map((el) => (
            <StyledItem key={uniqueId()}>{el}</StyledItem>
          ))}
        </StyledChildren>
      )}
    </StyledCollapse>
  );
};
