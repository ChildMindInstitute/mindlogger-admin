import { variables } from 'styles/variables';
import { StyledLabelBoldMedium } from 'styles/styledComponents/Typography';

import { MonthHeaderProps } from './MonthHeader.types';

export const MonthHeader = ({ date, label, calendarDate }: MonthHeaderProps) => {
  const currentDate = new Date();
  const isSameMonth = calendarDate.getMonth() === currentDate.getMonth();
  const isSelectedDay = date.getDay() === currentDate.getDay();

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
