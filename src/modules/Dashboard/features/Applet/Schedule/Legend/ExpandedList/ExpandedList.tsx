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
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

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
  'data-testid': dataTestid,
}: ExpandedListProps) => {
  const [listVisible, setListVisible] = useState(true);
  const { t } = useTranslation('app');
  const collapseBtnId = listVisible ? 'navigate-up' : 'navigate-down';
  const getIconBtnMargin = (index: number) => (index === 0 ? 'auto' : theme.spacing(0.4));

  return isHiddenInLegend ? null : (
    <StyledCollapse data-testid={dataTestid}>
      <StyledCollapseBtn
        onClick={toggleBooleanState(setListVisible)}
        data-testid={`${dataTestid}-collapse`}
      >
        <StyledFlexTopCenter sx={{ cursor: 'pointer' }}>
          <Svg id={collapseBtnId} />
          <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(1) }}>{title}</StyledLabelBoldLarge>
        </StyledFlexTopCenter>
        <Box>
          {buttons?.map((button, index) => (
            <Tooltip tooltipTitle={button.tooltipTitle} key={uniqueId()}>
              <Box component="span">
                <StyledIconBtn
                  disabled={button.disabled}
                  sx={{ ml: getIconBtnMargin(index) }}
                  onClick={(event) => {
                    event.stopPropagation();
                    button.action();
                  }}
                  data-testid={`${dataTestid}-${index}`}
                >
                  {button.icon}
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
            {items?.map((item, index) => (
              <StyledItem key={uniqueId()} data-testid={`${dataTestid}-item-${index}`}>
                {item}
              </StyledItem>
            ))}
          </StyledChildren>
        </>
      )}
    </StyledCollapse>
  );
};
