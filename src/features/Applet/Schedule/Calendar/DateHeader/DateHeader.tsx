import { DateHeaderProps } from 'react-big-calendar';

import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';

import { getMonthName } from '../Calendar.utils';

export const DateHeader = ({ date, drilldownView, onDrillDown }: DateHeaderProps) => {
  const dateComponent = `${
    date.getDate() === 1 ? `${getMonthName(date, 'short')} ` : ''
  }${date.getDate()}`;

  if (!drilldownView) {
    return <span>{dateComponent}</span>;
  }

  return (
    <StyledClearedButton onClick={onDrillDown} className="rbc-button-link" role="cell">
      {dateComponent}
    </StyledClearedButton>
  );
};
