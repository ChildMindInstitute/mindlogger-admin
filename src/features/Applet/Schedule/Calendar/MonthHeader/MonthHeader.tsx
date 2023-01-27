import { useMemo } from 'react';

import { variables } from 'styles/variables';
import { StyledLabelBoldMedium } from 'styles/styledComponents/Typography';

import { MonthHeaderProps } from './MonthHeader.types';

export const MonthHeader = ({ date, label, calendarDate }: MonthHeaderProps) => {
  const currentDate = useMemo(() => new Date(), []);
  const isSameMonth = useMemo(
    () => calendarDate.getMonth() === currentDate.getMonth(),
    [calendarDate, currentDate],
  );
  const isSelectedDay = useMemo(() => date.getDay() === currentDate.getDay(), [date, currentDate]);

  return (
    <StyledLabelBoldMedium
      sx={{
        color:
          isSelectedDay && isSameMonth
            ? variables.palette.primary
            : variables.palette.on_surface_variant,
      }}
    >
      {label}
    </StyledLabelBoldMedium>
  );
};
