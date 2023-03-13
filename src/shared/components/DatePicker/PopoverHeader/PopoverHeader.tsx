import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { StyledHeadline, StyledTitleSmall } from 'shared/styles/styledComponents';

import { StyledHeader, StyledSmalltext } from './PopoverHeader.styles';
import { UiType } from '../DatePicker.types';
import { getStringFromDateWithWeekDay } from '../DatePicker.utils';
import { PopoverHeaderProps } from './PopoverHeader.types';

export const PopoverHeader = ({ uiType, date }: PopoverHeaderProps) => {
  const { t } = useTranslation('app');
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const renderDate = (i: number) =>
    getStringFromDateWithWeekDay(Array.isArray(date) ? date[i] : date);

  return (
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
  );
};
