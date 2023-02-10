import { View } from 'react-big-calendar';

import { ToggleButtonGroup, Svg } from 'components';
import i18n from 'i18n';
import theme from 'styles/theme';
import { variables } from 'styles/variables';
import { StyledTitleBoldMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

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

  const handleViewChange = (value: CalendarViews) => {
    setActiveView(value);
    onView(value as View);
  };

  const currentDate = new Date();
  const selectedDay = formatToYearMonthDate(date);
  const todayDay = formatToYearMonthDate(currentDate);
  const isTodayInDayView = activeView === CalendarViews.Day && selectedDay === todayDay;
  const isSelectedFutureDate = () => {
    switch (activeView) {
      case CalendarViews.Year:
        return date.getFullYear() > currentDate.getFullYear();
      case CalendarViews.Month:
        return onlyMonthDate(date) > onlyMonthDate(currentDate);
      default:
        return date > currentDate;
    }
  };
  const isSelectedPastDate = () => {
    switch (activeView) {
      case CalendarViews.Year:
        return date.getFullYear() < currentDate.getFullYear();
      case CalendarViews.Month:
        return onlyMonthDate(date) < onlyMonthDate(currentDate);
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
