import { format } from 'date-fns';

import { Row } from 'shared/components';
import { variables } from 'shared/styles';
import { DateFormats } from 'shared/consts';
import { getTableCell } from 'shared/utils';
import { Activity, ActivityFlow, SingleApplet } from 'shared/state';
import { Event } from 'modules/Dashboard/state';
import { Periodicity } from 'modules/Dashboard/api';

import {
  AddEventsToCategories,
  LegendEvent,
  PreparedEvents,
  Repeats,
  ScheduleExportCsv,
} from './Schedule.types';

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
  periodicity === Periodicity.Once
    ? '-'
    : String(periodicity).charAt(0) + String(periodicity).slice(1).toLowerCase();

const getRepeatsAnswer = (periodicity: Periodicity) =>
  periodicity === Periodicity.Once ? Repeats.No : Repeats.Yes;

const removeSecondsFromTime = (time: string) => {
  const [hours, minutes] = time.split(':');

  return `${hours}:${minutes}`;
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
      },
      { periodicity, activityId, flowId, startTime: startTimeFull, endTime: endTimeFull },
    ) => {
      const { type, selectedDate, startDate } = periodicity;

      if (type !== Periodicity.Always) {
        const date = format(new Date(selectedDate || startDate), DateFormats.DayMonthYear);
        const startTime = removeSecondsFromTime(startTimeFull);
        const endTime = removeSecondsFromTime(endTimeFull);
        const activityOrFlowId = activityId || flowId;
        const activityName =
          activitiesAndFlows.find((item) => item.id === activityOrFlowId)?.name || '';
        // TODO: Add notification time after notifications connection to the API
        const notificationTime = '-';
        const repeats = getRepeatsAnswer(type);
        const frequency = getFrequencyString(type);

        acc.scheduleExportTableData.push({
          activityName: getTableCell(activityName),
          date: getTableCell(date),
          startTime: getTableCell(startTime),
          endTime: getTableCell(endTime),
          notificationTime: getTableCell(notificationTime),
          repeats: getTableCell(repeats),
          frequency: getTableCell(frequency),
        });
        acc.scheduleExportCsv.push({
          activityName,
          date,
          startTime,
          endTime,
          notificationTime,
          repeats,
          frequency,
        });
        acc.scheduledIds.push(activityId || flowId);
      }

      return acc;
    },
    { scheduleExportTableData: [], scheduleExportCsv: [], scheduledIds: [] },
  );

  const {
    scheduleExportTableData = [],
    scheduleExportCsv = [],
    scheduledIds = [],
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
    ) => addEventsToCategories({ id: id!, name, isFlow: !!activityIds, isHidden, index }),
  );

  return {
    alwaysAvailableEvents,
    scheduledEvents,
    deactivatedEvents,
    scheduleExportTableData,
    scheduleExportCsv,
  };
};
