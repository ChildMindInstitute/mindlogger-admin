import { useMemo } from 'react';
import { View } from 'react-big-calendar';

import { ToggleButtonGroup, Svg } from 'components';
import i18n from 'i18n';
import theme from 'styles/theme';
import { StyledTitleBoldMedium } from 'styles/styledComponents/Typography';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';

import { CalendarView } from '../Calendar.types';
import { StyledToolbar, StyledIconBtn, StyledViewsWrapper, StyledTodayBtn } from './Toolbar.styles';
import { getCalendarViewButtons } from './Toolbar.const';
import { ToolbarProps } from './Toolbar.types';

export const Toolbar = ({
  onView,
  onNavigate,
  label,
  activeView,
  setActiveView,
  date,
}: ToolbarProps) => {
  const { t } = i18n;

  const handleViewChange = (value: CalendarView) => {
    setActiveView(value);
    onView(value as View);
  };

  const formatDate = (date: Date) =>
    [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
  const onlyMonthDate = (date: Date) => new Date(date.getFullYear(), date.getMonth());

  const currentDate = useMemo(() => new Date(), []);
  const selectedDay = useMemo(() => formatDate(date), [date]);
  const todayDay = useMemo(() => formatDate(currentDate), [currentDate]);
  const isSelectedFutureDate = useMemo(() => {
    if (activeView === CalendarView.month) {
      return onlyMonthDate(date) > onlyMonthDate(currentDate);
    }

    return date > currentDate;
  }, [date, currentDate, activeView]);
  const isSelectedPastDate = useMemo(() => {
    if (activeView === CalendarView.month) {
      return onlyMonthDate(date) < onlyMonthDate(currentDate);
    }

    return todayDay !== selectedDay && date < currentDate;
  }, [date, selectedDay, todayDay, currentDate, activeView]);

  const todayButton = useMemo(
    () => (
      <StyledTodayBtn
        sx={{
          ...(isSelectedFutureDate && { marginRight: theme.spacing(1) }),
          ...(isSelectedPastDate && { margin: theme.spacing(0, 1) }),
        }}
        onClick={() => onNavigate('TODAY')}
        variant="text"
        startIcon={isSelectedFutureDate && <Svg id="triangle-left" />}
        endIcon={isSelectedPastDate && <Svg id="triangle-right" />}
      >
        {t('today')}
      </StyledTodayBtn>
    ),
    [isSelectedFutureDate, isSelectedPastDate, onNavigate, t],
  );

  return (
    <StyledToolbar>
      <StyledFlexTopCenter>
        {isSelectedFutureDate && todayButton}
        <StyledFlexTopCenter>
          <StyledIconBtn onClick={() => onNavigate('PREV')}>
            <Svg id="navigate-left" />
          </StyledIconBtn>
          <StyledTitleBoldMedium>{label}</StyledTitleBoldMedium>
          <StyledIconBtn onClick={() => onNavigate('NEXT')}>
            <Svg id="navigate-right" />
          </StyledIconBtn>
        </StyledFlexTopCenter>
        {isSelectedPastDate && todayButton}
      </StyledFlexTopCenter>
      <StyledViewsWrapper>
        <ToggleButtonGroup
          toggleButtons={getCalendarViewButtons()}
          activeButton={activeView}
          setActiveButton={(value) => handleViewChange(value as CalendarView)}
        />
      </StyledViewsWrapper>
    </StyledToolbar>
  );
};
