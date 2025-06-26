import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Tooltip } from 'shared/components/Tooltip';
import { StyledHeadlineSmall, StyledTitleSmall } from 'shared/styles/styledComponents';

import { UiType } from '../DatePicker.types';
import { getStringFromDateWithWeekDay } from '../DatePicker.utils';
import { StyledHeader, StyledSmalltext } from './PopoverHeader.styles';
import { PopoverHeaderProps } from './PopoverHeader.types';

export const PopoverHeader = ({ uiType, date, tooltip }: PopoverHeaderProps) => {
  const { t } = useTranslation('app');
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const renderDate = (i: number) =>
    getStringFromDateWithWeekDay(Array.isArray(date) ? date[i] : date);

  return (
    <Tooltip tooltipTitle={tooltip}>
      <StyledHeader>
        <Box>
          <StyledTitleSmall>
            {isStartEndingDate ? t('startDate') : t('selectDate')}
          </StyledTitleSmall>
          <StyledHeadlineSmall>{renderDate(0)}</StyledHeadlineSmall>
        </Box>
        {isStartEndingDate && (
          <>
            <StyledSmalltext>{t('to')}</StyledSmalltext>
            <Box>
              <StyledTitleSmall>{t('endDate')}</StyledTitleSmall>
              <StyledHeadlineSmall>{renderDate(1)}</StyledHeadlineSmall>
            </Box>
          </>
        )}
      </StyledHeader>
    </Tooltip>
  );
};
