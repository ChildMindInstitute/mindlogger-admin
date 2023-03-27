import { useState } from 'react';
import { Box } from '@mui/material';
import uniqueId from 'lodash.uniqueid';
import { useTranslation } from 'react-i18next';

import { Svg, Tooltip } from 'shared/components';
import {
  theme,
  StyledBodyMedium,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  variables,
} from 'shared/styles';

import {
  StyledChildren,
  StyledCollapseBtn,
  StyledCollapse,
  StyledItem,
  StyledIconBtn,
} from './ExpandedList.styles';
import { ExpandedListProps } from './ExpandedList.types';

export const ExpandedList = ({
  title,
  items,
  buttons,
  isHiddenInLegend,
  allAvailableScheduled,
}: ExpandedListProps) => {
  const [listVisible, setListVisible] = useState(true);
  const { t } = useTranslation('app');
  const collapseBtnId = listVisible ? 'navigate-up' : 'navigate-down';
  const getIconBtnMargin = (index: number) => (index === 0 ? 'auto' : theme.spacing(0.4));

  return isHiddenInLegend ? null : (
    <StyledCollapse>
      <StyledCollapseBtn onClick={() => setListVisible((prevState) => !prevState)}>
        <StyledFlexTopCenter sx={{ cursor: 'pointer' }}>
          <Svg id={collapseBtnId} />
          <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(1) }}>{title}</StyledLabelBoldLarge>
        </StyledFlexTopCenter>
        <Box>
          {buttons?.map((el, index) => (
            <Tooltip tooltipTitle={el.tooltipTitle} key={uniqueId()}>
              <Box component="span">
                <StyledIconBtn
                  disabled={el.disabled}
                  sx={{ ml: getIconBtnMargin(index) }}
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
        <>
          {allAvailableScheduled && (
            <StyledBodyMedium
              color={variables.palette.outline}
              sx={{ p: theme.spacing(2.4, 0.9, 0, 0.9) }}
            >
              {t('activateActivitiesScheduled')}
            </StyledBodyMedium>
          )}
          <StyledChildren>
            {items?.map((el) => (
              <StyledItem key={uniqueId()}>{el}</StyledItem>
            ))}
          </StyledChildren>
        </>
      )}
    </StyledCollapse>
  );
};
