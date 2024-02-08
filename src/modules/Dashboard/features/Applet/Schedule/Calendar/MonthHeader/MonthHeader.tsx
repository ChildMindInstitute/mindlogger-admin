import { firstVisibleDay, lastVisibleDay } from 'react-big-calendar/lib/utils/dates';

import { variables } from 'shared/styles/variables';
import { StyledLabelBoldMedium } from 'shared/styles/styledComponents';

import { MonthHeaderProps } from './MonthHeader.types';

export const MonthHeader = ({ date, label, calendarDate, localizer }: MonthHeaderProps) => {
  const nowDate = new Date();

  const isSamePeriod =
    nowDate >= firstVisibleDay(calendarDate, localizer) && nowDate <= lastVisibleDay(calendarDate, localizer);

  const isSelectedDay = date.getDay() === nowDate.getDay();

  return (
    <StyledLabelBoldMedium
      sx={{
        color: isSelectedDay && isSamePeriod ? variables.palette.primary : variables.palette.on_surface_variant,
      }}>
      {label}
    </StyledLabelBoldMedium>
  );
};
