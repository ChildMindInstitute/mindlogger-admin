import { View } from 'react-big-calendar';
import { getISOWeek } from 'date-fns';

import { ToggleButtonGroup, Svg } from 'shared/components';
import i18n from 'i18n';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';
import { StyledTitleBoldMedium, StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { formatToYearMonthDate } from '../Calendar.utils';
import { CalendarViews } from '../Calendar.types';
import { StyledToolbar, StyledIconBtn, StyledViewsWrapper, StyledTodayBtn } from './Toolbar.styles';
import { getCalendarViewButtons } from './Toolbar.const';
import { ToolbarProps, SetActiveBtnFunc } from './Toolbar.types';
import { onlyMonthDate } from './Toolbar.utils';

export const Toolbar = ({
  onView,
  onNavigate,
  label,
  activeView,
  setActiveView,
  date,
}: ToolbarProps) => {
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

  const handleViewChange = (value: CalendarViews) => {
    setActiveView(value);
    onView(value as View);
  };

  const isSelectedFutureDate = () => {
    switch (activeView) {
      case CalendarViews.Year:
        return dateYear > currentDateYear;
      case CalendarViews.Week:
        return (
          dateYear > currentDateYear || (dateYear === currentDateYear && dateWeek > currentDateWeek)
        );
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
        return (
          dateYear < currentDateYear || (dateYear === currentDateYear && dateWeek < currentDateWeek)
        );
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
    >
      {t('today')}
    </StyledTodayBtn>
  );

  return (
    <StyledToolbar>
      <StyledFlexTopCenter>
        {isSelectedFutureDate() && todayButton}
        <StyledFlexTopCenter>
          <StyledIconBtn onClick={() => onNavigate('PREV')}>
            <Svg id="navigate-left" />
          </StyledIconBtn>
          <StyledTitleBoldMedium
            color={isTodayInDayView ? variables.palette.primary : variables.palette.on_surface}
          >
            {label}
          </StyledTitleBoldMedium>
          <StyledIconBtn onClick={() => onNavigate('NEXT')}>
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
        />
      </StyledViewsWrapper>
    </StyledToolbar>
  );
};
