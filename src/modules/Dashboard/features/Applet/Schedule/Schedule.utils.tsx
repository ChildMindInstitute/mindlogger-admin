import { format } from 'date-fns';
import uniqueId from 'lodash.uniqueid';

import { Row } from 'shared/components';
import { variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { getTableCell } from 'shared/utils';
import { Activity, ActivityFlow, Event, SingleApplet } from 'modules/Dashboard/state';
import { Periodicity } from 'modules/Dashboard/api';

import {
  AddEventsToCategories,
  LegendEvent,
  PreparedEvents,
  Repeats,
  ScheduleExportCsv,
} from './Schedule.types';
import { CalendarEvent } from './Calendar/Calendar.types';

const getCount = (ids: string[], id: string) => ids.filter((item) => item === id).length;

/* eslint-disable camelcase */
const {
  blue,
  blue_alfa30,
  brown,
  brown_alfa30,
  gray,
  gray_alfa30,
  green,
  green_alfa30,
  orange,
  orange_alfa30,
  pink,
  pink_alfa30,
  yellow,
  yellow_alfa30,
  purple,
  purple_alfa30,
  red,
  red_alfa30,
} = variables.palette;

const colorsArray = [
  [blue, blue_alfa30],
  [green, green_alfa30],
  [orange, orange_alfa30],
  [brown, brown_alfa30],
  [yellow, yellow_alfa30],
  [pink, pink_alfa30],
  [gray, gray_alfa30],
  [red, red_alfa30],
  [purple, purple_alfa30],
];

const getNextColor = (index: number) => {
  const colorIndex = index % colorsArray.length;

  return colorsArray[colorIndex];
};

const getFrequencyString = (periodicity: Periodicity) =>
  String(periodicity).charAt(0) + String(periodicity).slice(1).toLowerCase();

const getRepeatsAnswer = (periodicity: Periodicity) => {
  if (periodicity === Periodicity.Always) return Repeats.NotSet;

  return periodicity === Periodicity.Once ? Repeats.No : Repeats.Yes;
};

const removeSecondsFromTime = (time: string) => {
  const [hours, minutes] = time.split(':');

  return `${hours}:${minutes}`;
};

const getDateFromDateTime = (date: string, time: string) => new Date(`${date}T${time}`);

const getEventStartDateTime = (
  periodicity: Periodicity,
  selectedDate: string,
  startDate: string,
  startTime: string,
) => {
  switch (periodicity) {
    case Periodicity.Always:
      return getDateFromDateTime(selectedDate, '00:00:00');
    case Periodicity.Once:
    case Periodicity.Weekly:
    case Periodicity.Monthly:
      return getDateFromDateTime(selectedDate, startTime);
    case Periodicity.Daily:
    case Periodicity.Weekdays:
      return getDateFromDateTime(startDate, startTime);
  }
};

const getEventEndDateTime = (
  periodicity: Periodicity,
  selectedDate: string,
  endDate: string,
  endTime: string,
) => {
  switch (periodicity) {
    case Periodicity.Always:
      return getDateFromDateTime(selectedDate, '00:00:00');
    // case Periodicity.Once:
    // case Periodicity.Weekly:
    // case Periodicity.Monthly:
    //   return getDateFromDateTime(selectedDate, startTime);
    // case Periodicity.Daily:
    // case Periodicity.Weekdays:
    //   return getDateFromDateTime(startDate, startTime);
  }
};

const createEvents = (
  activityOrFlowId: string,
  activityOrFlowName: string,
  periodicityType: Periodicity,
  selectedDate: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  isAlwaysAvailable: boolean,
  flowId?: string,
) => {
  const eventStart = getEventStartDateTime(periodicityType, selectedDate, startDate, startTime);
  const eventEnd = getEventEndDateTime(periodicityType, selectedDate, endDate, endTime);

  return {
    id: uniqueId('event'),
    resourceId: activityOrFlowId,
    title: activityOrFlowName,
    start: eventStart,

    end: new Date(),
    backgroundColor: 'string',

    alwaysAvailable: isAlwaysAvailable,
    isHidden: false,
    startFlowIcon: !!flowId,

    // isHiddenInTimeView: false,
    // scheduledColor: 'string',
    // scheduledBackground: 'string',
    // allDayEvent: false,
    // endAlertIcon: false,
    // isOffRange: false,
    // eventSpanBefore: false,
    // eventSpanAfter: false,
  };
};
export const getPreparedEvents = (
  appletData?: SingleApplet,
  events?: Event[],
): PreparedEvents | null => {
  if (!appletData) return null;

  const { activities = [], activityFlows = [] } = appletData;
  const activitiesAndFlows = [...activities, ...activityFlows];

  const eventsData = events?.reduce(
    (
      acc: {
        scheduleExportTableData: Row[];
        scheduleExportCsv: ScheduleExportCsv;
        scheduledIds: string[];
        calendarEvents: CalendarEvent[];
      },
      { periodicity, activityId, flowId, startTime: startTimeFull, endTime: endTimeFull },
      index,
    ) => {
      const { type: periodicityType, selectedDate, startDate, endDate } = periodicity;
      const isAlwaysAvailable = periodicityType === Periodicity.Always;

      const date = format(new Date(selectedDate || startDate), DateFormats.DayMonthYear);
      const startTime = isAlwaysAvailable ? '-' : removeSecondsFromTime(startTimeFull);
      const endTime = isAlwaysAvailable ? '-' : removeSecondsFromTime(endTimeFull);
      const activityOrFlowId = activityId || flowId;
      const currentActivityOrFlow = activitiesAndFlows.find((item) => item.id === activityOrFlowId);
      const activityOrFlowName = currentActivityOrFlow?.name || '';
      // TODO: Add notification time after notifications connection to the API
      const notificationTime = '-';
      const repeats = getRepeatsAnswer(periodicityType);
      const frequency = getFrequencyString(periodicityType);

      acc.scheduleExportTableData.push({
        activityName: getTableCell(activityOrFlowName),
        date: getTableCell(date),
        startTime: getTableCell(startTime),
        endTime: getTableCell(endTime),
        notificationTime: getTableCell(notificationTime),
        repeats: getTableCell(repeats),
        frequency: getTableCell(frequency),
      });

      acc.scheduleExportCsv.push({
        activityName: activityOrFlowName,
        date,
        startTime,
        endTime,
        notificationTime,
        repeats,
        frequency,
      });

      const calendarEvents = createEvents(
        activityOrFlowId,
        activityOrFlowName,
        periodicityType,
        selectedDate,
        startDate,
        endDate,
        startTimeFull,
        endTimeFull,
        isAlwaysAvailable,
        flowId,
      );

      acc.calendarEvents.push(calendarEvents);

      if (periodicityType !== Periodicity.Always) {
        acc.scheduledIds.push(activityId || flowId);
      }

      return acc;
    },
    { scheduleExportTableData: [], scheduleExportCsv: [], scheduledIds: [], calendarEvents: [] },
  );

  const {
    scheduleExportTableData = [],
    scheduleExportCsv = [],
    scheduledIds = [],
    calendarEvents = [],
  } = eventsData ?? {};

  const alwaysAvailableEvents: LegendEvent[] = [];
  const scheduledEvents: LegendEvent[] = [];
  const deactivatedEvents: LegendEvent[] = [];

  const addEventsToCategories = ({ id, name, isFlow, isHidden, index }: AddEventsToCategories) => {
    const colors = getNextColor(index);
    const event = { id, name, isFlow };
    if (isHidden) return deactivatedEvents.push(event);

    if (scheduledIds.some((scheduledId) => scheduledId === id)) {
      return scheduledEvents.push({ ...event, count: getCount(scheduledIds, id), colors });
    }
    alwaysAvailableEvents.push({ ...event, colors: [colors[0], colors[0]] });
  };

  activitiesAndFlows.forEach(
    (
      { id, name, isHidden, activityIds }: ActivityFlow | (Activity & { activityIds?: string[] }),
      index,
    ) => addEventsToCategories({ id, name, isFlow: !!activityIds, isHidden, index }),
  );

  return {
    alwaysAvailableEvents,
    scheduledEvents,
    deactivatedEvents,
    scheduleExportTableData,
    scheduleExportCsv,
    calendarEvents,
  };
};
