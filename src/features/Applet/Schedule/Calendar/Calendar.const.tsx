import { Dispatch, SetStateAction } from 'react';
import { HeaderProps, ToolbarProps } from 'react-big-calendar';

import { variables } from 'styles/variables';
import i18n from 'i18n';

import { Toolbar } from './Toolbar';
import { MonthHeader } from './MonthHeader';
import { MonthEvent } from './MonthEvent';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import { CalendarEvent } from './Calendar.types';

const { t } = i18n;

export const getCalendarComponents = (
  activeView: string,
  setActiveView: Dispatch<SetStateAction<string>>,
  date: Date,
) => ({
  components: {
    toolbar: (props: ToolbarProps) => (
      <Toolbar {...props} activeView={activeView} setActiveView={setActiveView} />
    ),
    month: {
      header: (props: HeaderProps) => <MonthHeader {...props} calendarDate={date} />,
      event: MonthEvent,
    },
  },
  messages: {
    showMore: (total: number) => `${total} ${t('more').toLowerCase()}...`,
  },
  views: {
    month: MonthView,
    day: true,
    week: true,
    year: YearView,
  },
});

export const eventPropGetter = (event: CalendarEvent) => ({
  style: {
    backgroundColor: event.backgroundColor,
    maxWidth: '92%',
    margin: '0 auto',
    color: event.alwaysAvailable ? variables.palette.white : variables.palette.on_surface,
    ...(event.isOffRange && { opacity: '0.38' }),
  },
});

export const mockedEvents: CalendarEvent[] = [
  {
    id: 'daily-journal-id',
    title: 'Daily Journal',
    start: new Date(2022, 11, 31, 0, 0, 0),
    end: new Date(2022, 11, 31, 24, 0, 0),
    backgroundColor: variables.palette.blue_alfa30,
    alwaysAvailable: false,
  },
  {
    id: 'pre-questionnaire-id',
    title: 'Pre-questionnaire',
    start: new Date(2022, 11, 31, 0, 0, 0),
    end: new Date(2022, 11, 31, 24, 0, 0),
    backgroundColor: variables.palette.green_alfa30,
    alwaysAvailable: false,
    endAlertIcon: true,
    startFlowIcon: true,
  },
  {
    id: 'daily-journal-id',
    title: 'Daily Journal',
    start: new Date(2023, 0, 1, 0, 0, 0),
    end: new Date(2023, 0, 1, 24, 0, 0),
    backgroundColor: variables.palette.blue_alfa30,
    alwaysAvailable: false,
  },
  {
    id: 'daily-journal-id',
    title: 'Daily Journal',
    start: new Date(2023, 0, 2, 0, 0, 0),
    end: new Date(2023, 0, 2, 24, 0, 0),
    backgroundColor: variables.palette.blue_alfa30,
    alwaysAvailable: false,
  },
  {
    id: 'daily-journal-id',
    title: 'Daily Journal',
    start: new Date(2023, 0, 3, 0, 0, 0),
    end: new Date(2023, 0, 3, 24, 0, 0),
    backgroundColor: variables.palette.blue_alfa30,
    alwaysAvailable: false,
  },
  {
    id: 'pre-questionnaire-id',
    title: 'Pre-questionnaire',
    start: new Date(2023, 0, 1, 8, 30, 0),
    end: new Date(2023, 0, 1, 12, 30, 0),
    backgroundColor: variables.palette.green_alfa30,
    alwaysAvailable: false,
    endAlertIcon: true,
    startFlowIcon: true,
  },
  {
    id: 'midday-assessment-id',
    title: 'Midday Assessment',
    start: new Date(2023, 0, 3, 13, 30, 0),
    end: new Date(2023, 0, 3, 20, 30, 0),
    alwaysAvailable: false,
    backgroundColor: variables.palette.white,
    startIndicator: variables.palette.orange,
    startTime: '5:00',
    endAlertIcon: true,
  },
  {
    id: 'morning-assessment-id',
    title: 'Morning Assessment',
    start: new Date(2023, 0, 3, 8, 30, 0),
    end: new Date(2023, 0, 3, 12, 30, 0),
    alwaysAvailable: false,
    backgroundColor: variables.palette.white,
    startIndicator: variables.palette.yellow,
    startTime: '5:00',
    endAlertIcon: true,
  },
  {
    id: 'morning-assessment-id',
    title: 'Morning Assessment 2',
    start: new Date(2023, 0, 3, 8, 30, 0),
    end: new Date(2023, 0, 3, 12, 30, 0),
    alwaysAvailable: false,
    backgroundColor: variables.palette.white,
    startIndicator: variables.palette.yellow,
    startTime: '5:00',
    endAlertIcon: true,
  },
  {
    id: 'one-day-id',
    title: 'One Day Month Event',
    start: new Date(2023, 0, 25, 5, 30, 0),
    end: new Date(2023, 0, 25, 12, 30, 0),
    alwaysAvailable: false,
    backgroundColor: variables.palette.blue_alfa30,
  },
  {
    id: 'morning-assessment-id',
    title: 'Morning Assessment',
    start: new Date(2023, 0, 25, 8, 30, 0),
    end: new Date(2023, 0, 25, 12, 30, 0),
    alwaysAvailable: false,
    backgroundColor: variables.palette.white,
    startIndicator: variables.palette.yellow,
    startTime: '5:00',
    endAlertIcon: true,
  },
  {
    id: 'emotional-support-id',
    title: 'Emotional Support',
    start: new Date(2023, 0, 16, 0, 0, 0),
    end: new Date(2023, 0, 16, 24, 0, 0),
    alwaysAvailable: true,
    backgroundColor: variables.palette.blue,
  },
  {
    id: 'incentive-activity-id',
    title: 'Incentive Activity',
    start: new Date(2023, 0, 16, 0, 0, 0),
    end: new Date(2023, 0, 16, 24, 0, 0),
    alwaysAvailable: true,
    backgroundColor: variables.palette.green,
    endAlertIcon: true,
  },
  {
    id: 'emotional-support-id',
    title: 'Emotional Support',
    start: new Date(2023, 0, 17, 0, 0, 0),
    end: new Date(2023, 0, 17, 24, 0, 0),
    alwaysAvailable: true,
    backgroundColor: variables.palette.blue,
  },
  {
    id: 'incentive-activity-id',
    title: 'Incentive Activity',
    start: new Date(2023, 0, 17, 0, 0, 0),
    end: new Date(2023, 0, 17, 24, 0, 0),
    alwaysAvailable: true,
    backgroundColor: variables.palette.green,
    endAlertIcon: true,
  },
  {
    id: 'incentive-activity-id',
    title: 'Incentive Activity',
    start: new Date(2023, 0, 18, 0, 0, 0),
    end: new Date(2023, 0, 18, 24, 0, 0),
    alwaysAvailable: true,
    backgroundColor: variables.palette.green,
    endAlertIcon: true,
  },
];
