import { useState } from 'react';
import { Box } from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import { Svg, Tooltip } from 'shared/components';
import { StyledFlexTopCenter, StyledLabelBoldLarge } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

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
        <StyledFlexTopCenter sx={{ cursor: 'pointer' }}>
          <Svg id={listVisible ? 'navigate-up' : 'navigate-down'} />
          <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(1) }}>{title}</StyledLabelBoldLarge>
        </StyledFlexTopCenter>
        <Box>
          {buttons?.map((el, i) => (
            <Tooltip tooltipTitle={el.tooltipTitle} key={uniqueId()}>
              <Box component="span">
                <StyledIconBtn
                  disabled={el.disabled}
                  sx={{ marginLeft: i === 0 ? 'auto' : theme.spacing(0.4) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    el.action();
                  }}
                >
                  {el.icon}
                </StyledIconBtn>
              </Box>
            </Tooltip>
          ))}
        </Box>
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
