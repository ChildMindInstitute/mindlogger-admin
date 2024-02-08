import { SelectChangeEvent, Box } from '@mui/material';
import { getYear } from 'date-fns';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { theme } from 'shared/styles';

import { UiType } from '../DatePicker.types';
import { startYear, endYear } from './DatePickerHeader.const';
import { StyledCol, StyledHeader, StyledIconBtn, StyledSelect } from './DatePickerHeader.styles';
import { getMonthsArr, getRange } from './DatePickerHeader.utils';
import { Select } from './Select';

export const DatePickerHeader = ({
  monthDate,
  decreaseMonth,
  increaseMonth,
  customHeaderCount,
  uiType,
  changeYear,
  date,
}: { uiType: UiType } & ReactDatePickerCustomHeaderProps) => {
  const { t } = useTranslation('app');
  const months = getMonthsArr(t);
  const years = getRange(startYear, endYear);
  const isStartEndingDate = uiType === UiType.StartEndingDate;

  const changeYearHandler = ({ target: { value } }: SelectChangeEvent) => {
    changeYear(+value);
  };

  const renderLeftNavigateBtn = () => (
    <StyledIconBtn onClick={decreaseMonth}>
      <Svg id="navigate-left" />
    </StyledIconBtn>
  );

  return (
    <StyledHeader isStartEndingDate={isStartEndingDate}>
      {customHeaderCount === 0 && isStartEndingDate && (
        <StyledCol sx={{ marginLeft: theme.spacing(-0.8) }}>{renderLeftNavigateBtn()}</StyledCol>
      )}
      <StyledSelect sx={{ gridColumnStart: isStartEndingDate ? 2 : 1 }}>
        <>
          <Box sx={{ marginRight: theme.spacing(0.5) }}>{months[monthDate.getMonth()]}</Box>
          {isStartEndingDate ? (
            getYear(date)
          ) : (
            <Select value={String(getYear(date))} changeValue={changeYearHandler} options={years} />
          )}
        </>
      </StyledSelect>
      <StyledCol sx={{ margin: theme.spacing(0, -0.8, 0, 'auto') }}>
        {!isStartEndingDate && renderLeftNavigateBtn()}
        {(!isStartEndingDate || customHeaderCount === 1) && (
          <StyledIconBtn onClick={increaseMonth}>
            <Svg id="navigate-right" />
          </StyledIconBtn>
        )}
      </StyledCol>
    </StyledHeader>
  );
};
