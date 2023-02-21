import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledLabelBoldMedium, StyledClearedButton } from 'styles/styledComponents';

import { CalendarEvent, CalendarViews } from '../Calendar.types';
import {
  allDayEventsSortedByDays,
  formatToWeekYear,
  formatToYearMonthDate,
  hiddenEventsIds,
} from '../Calendar.utils';
import { StyledTimeGutterHeader } from './TimeGutterHeader.styles';
import { TimeGutterHeaderProps } from './TimeGutterHeader.types';

export const TimeGutterHeader = ({
  date,
  isAllDayEventsVisible,
  setIsAllDayEventsVisible,
  setEvents,
  activeView,
}: TimeGutterHeaderProps) => {
  const { t } = useTranslation('app');
  const currentDate = formatToYearMonthDate(date);
  const currentWeek = formatToWeekYear(date);
  const isDayView = activeView === CalendarViews.Day;
  const isWeekView = activeView === CalendarViews.Week;

  const getDayCondition = (event: CalendarEvent) =>
    isDayView && formatToYearMonthDate(event.start) === currentDate;

  const getWeekCondition = (event: CalendarEvent) =>
    isWeekView && formatToWeekYear(event.start) === currentWeek;

  const getShowEventsCondition = (event: CalendarEvent, isVisible: boolean | undefined) =>
    // eslint-disable-next-line no-prototype-builtins
    event.hasOwnProperty('isHiddenInTimeView') &&
    !isVisible &&
    (getWeekCondition(event) || getDayCondition(event));

  const navigateIconCondition =
    (isAllDayEventsVisible?.period === currentDate ||
      isAllDayEventsVisible?.period === currentWeek) &&
    isAllDayEventsVisible?.visible;

  const handleBtnClick = () => {
    setIsAllDayEventsVisible((prevState) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (getShowEventsCondition(event, prevState?.visible)) {
            return {
              ...event,
              isHiddenInTimeView: false,
            };
          }

          return {
            ...event,
            isHiddenInTimeView: hiddenEventsIds.some((id) => id === event.id),
          };
        }),
      );

      return {
        period: isDayView ? currentDate : currentWeek,
        visible:
          (isDayView && currentDate === prevState?.period) ||
          (isWeekView && currentWeek === prevState?.period)
            ? !prevState?.visible
            : true,
      };
    });
  };

  const isBtnDisabled =
    (isDayView && allDayEventsSortedByDays.every((el) => el.date !== currentDate)) ||
    (isWeekView && allDayEventsSortedByDays.every((el) => el.week !== currentWeek));

  return (
    <StyledTimeGutterHeader>
      <StyledClearedButton
        sx={{ p: theme.spacing(0.2) }}
        onClick={handleBtnClick}
        disabled={isBtnDisabled}
      >
        <Svg
          id={navigateIconCondition ? 'navigate-down' : 'navigate-right'}
          width="19"
          height="19"
        />
      </StyledClearedButton>
      <StyledLabelBoldMedium sx={{ ml: theme.spacing(0.4) }} color={variables.palette.outline}>
        {t('allDay')}
      </StyledLabelBoldMedium>
    </StyledTimeGutterHeader>
  );
};
