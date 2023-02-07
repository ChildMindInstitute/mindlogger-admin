import { SelectChangeEvent } from '@mui/material';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components';

import { UiType } from '../DatePicker.types';
import { getMonthsArr } from './DatePickerHeader.utils';
import { StyledCol, StyledHeader, StyledIconBtn, StyledSelect } from './DatePickerHeader.styles';
import { Select } from './Select';

export const DatePickerHeader = ({
  monthDate,
  decreaseMonth,
  increaseMonth,
  customHeaderCount,
  changeMonth,
  uiType,
}: { uiType: UiType } & ReactDatePickerCustomHeaderProps) => {
  const { t } = useTranslation('app');
  const months = getMonthsArr(t);
  const isStartEndingDate = uiType === UiType.startEndingDate;

  const changeMonthHandler = ({ target: { value } }: SelectChangeEvent) => {
    changeMonth(months.indexOf(value));
  };

  const renderLeftNavigateBtn = () => (
    <StyledIconBtn onClick={decreaseMonth}>
      <Svg id="navigate-left" />
    </StyledIconBtn>
  );

  return (
    <StyledHeader>
      {customHeaderCount === 0 && isStartEndingDate && (
        <StyledCol>{renderLeftNavigateBtn()}</StyledCol>
      )}
      <StyledSelect>
        <Select
          value={months[monthDate.getMonth()]}
          changeValue={changeMonthHandler}
          options={months}
        />
      </StyledSelect>
      <StyledCol sx={{ marginLeft: 'auto' }}>
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
