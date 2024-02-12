import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { theme, variables, StyledLabelBoldMedium, StyledClearedButton } from 'shared/styles';
import { CalendarEvent, calendarEvents } from 'modules/Dashboard/state';
import { formatToWeekYear, formatToYearMonthDate } from 'shared/utils/dateFormat';

import { CalendarViews } from '../Calendar.types';
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
  const { hiddenEventsIds = [], allDayEventsSortedByDays = [] } =
    calendarEvents.useVisibleEventsData() || {};

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
            isHiddenInTimeView: hiddenEventsIds?.some((id) => id === event.id),
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

  const isBtnDisabled = !allDayEventsSortedByDays?.some(
    (el) => (isDayView && el.date === currentDate) || (isWeekView && el.week === currentWeek),
  );

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
