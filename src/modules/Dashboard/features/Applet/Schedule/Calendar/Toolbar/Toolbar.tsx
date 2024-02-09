import { getISOWeek } from 'date-fns';
import { View } from 'react-big-calendar';

import i18n from 'i18n';
import { ToggleButtonGroup, Svg } from 'shared/components';
import { theme, variables, StyledTitleBoldMedium, StyledFlexTopCenter } from 'shared/styles';
import { formatToYearMonthDate } from 'shared/utils/dateFormat';

import { CalendarViews } from '../Calendar.types';
import { getCalendarViewButtons } from './Toolbar.const';
import { StyledToolbar, StyledIconBtn, StyledViewsWrapper, StyledTodayBtn } from './Toolbar.styles';
import { ToolbarProps, SetActiveBtnFunc } from './Toolbar.types';
import { onlyMonthDate } from './Toolbar.utils';

export const Toolbar = ({ onView, onNavigate, label, activeView, setActiveView, date }: ToolbarProps) => {
  const { t } = i18n;
  const currentDate = new Date();
  const selectedDay = formatToYearMonthDate(date);
  const todayDay = formatToYearMonthDate(currentDate);
  const isTodayInDayView = activeView === CalendarViews.Day && selectedDay === todayDay;
  const dateYear = date.getFullYear();
  const currentDateYear = currentDate.getFullYear();
  const dateWeek = getISOWeek(date);
  const currentDateWeek = getISOWeek(currentDate);
  const dateMonth = onlyMonthDate(date);
  const currentDateMonth = onlyMonthDate(currentDate);
  const dataTestid = 'schedule-calendar-current-date-toolbar';

  const handleViewChange = (value: CalendarViews) => {
    setActiveView(value);
    onView(value as View);
  };

  const isSelectedFutureDate = () => {
    switch (activeView) {
      case CalendarViews.Year:
        return dateYear > currentDateYear;
      case CalendarViews.Week:
        return dateYear > currentDateYear || (dateYear === currentDateYear && dateWeek > currentDateWeek);
      case CalendarViews.Month:
        return dateMonth > currentDateMonth;
      default:
        return date > currentDate;
    }
  };
  const isSelectedPastDate = () => {
    switch (activeView) {
      case CalendarViews.Year:
        return dateYear < currentDateYear;
      case CalendarViews.Week:
        return dateYear < currentDateYear || (dateYear === currentDateYear && dateWeek < currentDateWeek);
      case CalendarViews.Month:
        return dateMonth < currentDateMonth;
      default:
        return todayDay !== selectedDay && date < currentDate;
    }
  };

  const todayButton = (
    <StyledTodayBtn
      sx={{
        ...(isSelectedFutureDate() && { marginRight: theme.spacing(1) }),
        ...(isSelectedPastDate() && { margin: theme.spacing(0, 1) }),
      }}
      onClick={() => onNavigate('TODAY')}
      variant="text"
      startIcon={isSelectedFutureDate() && <Svg id="triangle-left" />}
      endIcon={isSelectedPastDate() && <Svg id="triangle-right" />}
      data-testid={`${dataTestid}-today`}
    >
      {t('today')}
    </StyledTodayBtn>
  );

  return (
    <StyledToolbar data-testid={dataTestid}>
      <StyledFlexTopCenter>
        {isSelectedFutureDate() && todayButton}
        <StyledFlexTopCenter>
          <StyledIconBtn onClick={() => onNavigate('PREV')} data-testid={`${dataTestid}-prev`}>
            <Svg id="navigate-left" />
          </StyledIconBtn>
          <StyledTitleBoldMedium color={isTodayInDayView ? variables.palette.primary : variables.palette.on_surface}>
            {label}
          </StyledTitleBoldMedium>
          <StyledIconBtn onClick={() => onNavigate('NEXT')} data-testid={`${dataTestid}-next`}>
            <Svg id="navigate-right" />
          </StyledIconBtn>
        </StyledFlexTopCenter>
        {isSelectedPastDate() && todayButton}
      </StyledFlexTopCenter>
      <StyledViewsWrapper>
        <ToggleButtonGroup
          toggleButtons={getCalendarViewButtons()}
          activeButton={activeView}
          setActiveButton={handleViewChange as SetActiveBtnFunc}
          data-testid={`${dataTestid}-view-mode`}
        />
      </StyledViewsWrapper>
    </StyledToolbar>
  );
};
