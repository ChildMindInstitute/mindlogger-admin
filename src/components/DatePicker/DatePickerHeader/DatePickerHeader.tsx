import { SelectChangeEvent } from '@mui/material';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { useTranslation } from 'react-i18next';

import { Svg } from 'components/Svg';
import { StyledLabelBoldLarge } from 'styles/styledComponents/Typography';
import theme from 'styles/theme';

import { UiType } from '../DatePicker.types';
import { getMonthsArr } from './DatePickerHeader.utils';
import { StyledBox, StyledHeader, StyledIconBtn } from './DatePickerHeader.styles';
import { Select } from './Select';

export const DatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  decreaseYear,
  increaseYear,
  changeMonth,
  uiType,
}: { uiType: UiType } & ReactDatePickerCustomHeaderProps) => {
  const { t } = useTranslation('app');

  const months = getMonthsArr(t);
  const changeMonthSelect = ({ target: { value } }: SelectChangeEvent) => {
    changeMonth(months.indexOf(value));
  };

  return (
    <StyledHeader
      sx={{
        padding:
          uiType === UiType.startEndingDate ? theme.spacing(2, 1.2, 3) : theme.spacing(3, 1.2),
      }}
    >
      <StyledBox>
        <StyledIconBtn onClick={decreaseMonth}>
          <Svg id="navigate-left" />
        </StyledIconBtn>
        <Select value={months[date.getMonth()]} changeValue={changeMonthSelect} options={months} />
        <StyledIconBtn onClick={increaseMonth}>
          <Svg id="navigate-right" />
        </StyledIconBtn>
      </StyledBox>
      <StyledBox>
        <StyledIconBtn onClick={decreaseYear}>
          <Svg id="navigate-left" />
        </StyledIconBtn>
        <StyledLabelBoldLarge>{String(date.getFullYear())}</StyledLabelBoldLarge>
        <StyledIconBtn onClick={increaseYear}>
          <Svg id="navigate-right" />
        </StyledIconBtn>
      </StyledBox>
    </StyledHeader>
  );
};
