import { DateHeaderProps } from 'react-big-calendar';

import { StyledClearedButton } from 'shared/styles';
import { getMonthName } from 'modules/Dashboard/features/Applet/Schedule/Calendar/Calendar.utils';

import { NameLength } from '../Calendar.types';

export const DateHeader = ({ date, drilldownView, onDrillDown }: DateHeaderProps) => {
  const dateText = `${
    date.getDate() === 1 ? `${getMonthName(date, NameLength.Short)} ` : ''
  }${date.getDate()}`;

  if (!drilldownView) {
    return <span>{dateText}</span>;
  }

  return (
    <StyledClearedButton onClick={onDrillDown} className="rbc-button-link" role="cell">
      {dateText}
    </StyledClearedButton>
  );
};
