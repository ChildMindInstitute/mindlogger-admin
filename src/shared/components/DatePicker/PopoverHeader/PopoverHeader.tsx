import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledHeadline, StyledTitleSmall } from 'shared/styles/styledComponents';

import { UiType } from '../DatePicker.types';
import { getStringFromDateWithWeekDay } from '../DatePicker.utils';
import { StyledHeader, StyledSmalltext } from './PopoverHeader.styles';
import { PopoverHeaderProps } from './PopoverHeader.types';

export const PopoverHeader = ({ uiType, date, tooltip }: PopoverHeaderProps) => {
  const { t } = useTranslation('app');
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const renderDate = (i: number) => getStringFromDateWithWeekDay(Array.isArray(date) ? date[i] : date);

  return (
    <Tooltip tooltipTitle={tooltip}>
      <StyledHeader>
        <Box>
          <StyledTitleSmall>{isStartEndingDate ? t('startDate') : t('selectDate')}</StyledTitleSmall>
          <StyledHeadline>{renderDate(0)}</StyledHeadline>
        </Box>
        {isStartEndingDate && (
          <>
            <StyledSmalltext>{t('to')}</StyledSmalltext>
            <Box>
              <StyledTitleSmall>{t('endDate')}</StyledTitleSmall>
              <StyledHeadline>{renderDate(1)}</StyledHeadline>
            </Box>
          </>
        )}
      </StyledHeader>
    </Tooltip>
  );
};
