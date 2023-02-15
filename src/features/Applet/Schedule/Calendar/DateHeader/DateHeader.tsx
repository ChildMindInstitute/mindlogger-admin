import { DateHeaderProps } from 'react-big-calendar';

import { StyledClearedButton } from 'styles/styledComponents';

import { getMonthName } from '../Calendar.utils';

export const DateHeader = ({ date, drilldownView, onDrillDown }: DateHeaderProps) => {
  const dateText = `${
    date.getDate() === 1 ? `${getMonthName(date, 'short')} ` : ''
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
