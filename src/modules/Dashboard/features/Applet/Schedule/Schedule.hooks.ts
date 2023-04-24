import { useEffect } from 'react';
import { format } from 'date-fns';

import { Activity, ActivityFlow, SingleApplet } from 'shared/state';
import { calendarEvents, Event } from 'modules/Dashboard/state';
import { Periodicity } from 'modules/Dashboard/api';
import { DateFormats } from 'shared/consts';
import { getTableCell } from 'shared/utils';
import { useAppDispatch } from 'redux/store';
import { createEvents } from 'modules/Dashboard/state/CalendarEvents/CalendarEvents.utils';

import { AddEventsToCategories, EventsData, LegendEvent, PreparedEvents } from './Schedule.types';
import {
  getNextColor,
  removeSecondsFromTime,
  getRepeatsAnswer,
  getFrequencyString,
  getCount,
} from './Schedule.utils';

export const usePreparedEvents = (
  appletData?: SingleApplet,
  events?: Event[],
): PreparedEvents | null => {
  const dispatch = useAppDispatch();
  const alwaysAvailableEvents: LegendEvent[] = [];
  const scheduledEvents: LegendEvent[] = [];
  const deactivatedEvents: LegendEvent[] = [];
  let eventsData: EventsData | undefined;

  if (appletData) {
    const { activities = [], activityFlows = [] } = appletData;
    const activitiesAndFlows = [...activities, ...activityFlows].map((item, index) => ({
      ...item,
      colors: getNextColor(index),
    }));

    eventsData = events?.reduce(
      (
        acc: EventsData,
        {
          periodicity,
          activityId,
          flowId,
          startTime: startTimeFull,
          endTime: endTimeFull,
          oneTimeCompletion,
          accessBeforeSchedule,
          timerType,
          timer,
          id: eventId,
        },
      ) => {
        const activityOrFlowId = activityId || flowId || '';
        const currentActivityOrFlow = activitiesAndFlows.find(
          (item) => item.id === activityOrFlowId,
        );

        if (!currentActivityOrFlow?.isHidden) {
          const { type: periodicityType, selectedDate, startDate, endDate } = periodicity;
          const isAlwaysAvailable = periodicityType === Periodicity.Always;
          const date = format(new Date(selectedDate || startDate || ''), DateFormats.DayMonthYear);
          const startTime = isAlwaysAvailable ? '-' : removeSecondsFromTime(startTimeFull);
          const endTime = isAlwaysAvailable ? '-' : removeSecondsFromTime(endTimeFull);
          const activityOrFlowName = currentActivityOrFlow?.name || '';
          // TODO: Add notification time after notifications connection to the API
          const notificationTime = '-';
          const repeats = getRepeatsAnswer(periodicityType);
          const frequency = getFrequencyString(periodicityType);
          const activityOrFlowColors = currentActivityOrFlow?.colors || ['', ''];
          const currentYear = new Date().getFullYear();

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

          const dataToCreateEvent = {
            activityOrFlowId,
            eventId,
            activityOrFlowName,
            periodicityType,
            selectedDate,
            startDate,
            endDate,
            startTime: startTimeFull,
            endTime: endTimeFull,
            isAlwaysAvailable,
            colors: activityOrFlowColors,
            flowId,
            nextYearDateString: null,
            currentYear,
            oneTimeCompletion,
            accessBeforeSchedule,
            timerType,
            timer,
          };

          if (dataToCreateEvent) {
            acc.eventsDataArr.push(dataToCreateEvent);
          }

          const calendarEvents = createEvents(dataToCreateEvent);

          if (calendarEvents) {
            acc.calendarEventsArr.push(...calendarEvents);
          }

          if (periodicityType === Periodicity.Always) {
            acc.alwaysActivitiesFlows.push({
              color: [activityOrFlowColors[0], activityOrFlowColors[0]],
              id: activityOrFlowId,
            });
          } else {
            acc.scheduledActivitiesFlows.push({
              color: activityOrFlowColors,
              id: activityOrFlowId,
            });
          }
        }

        return acc;
      },
      {
        scheduleExportTableData: [],
        scheduleExportCsv: [],
        scheduledActivitiesFlows: [],
        alwaysActivitiesFlows: [],
        calendarEventsArr: [],
        eventsDataArr: [],
      },
    );

    const { scheduledActivitiesFlows = [], alwaysActivitiesFlows = [] } = eventsData ?? {};

    const addEventsToCategories = ({ id, name, isFlow, isHidden }: AddEventsToCategories) => {
      const event = { id, name, isFlow };
      if (isHidden) return deactivatedEvents.push(event);

      const scheduledActivityFlow = scheduledActivitiesFlows.find((item) => item.id === id);
      if (scheduledActivityFlow) {
        const colors = scheduledActivityFlow.color;

        return scheduledEvents.push({
          ...event,
          count: getCount(scheduledActivitiesFlows, id),
          colors,
        });
      }

      const alwaysActivityFlow = alwaysActivitiesFlows.find((flow) => flow.id === id);
      const colors = alwaysActivityFlow?.color || [];
      alwaysAvailableEvents.push({
        ...event,
        colors: [colors[0], colors[0]],
      });
    };

    activitiesAndFlows.forEach(
      ({
        id,
        name,
        isHidden,
        activityIds,
      }: ActivityFlow | (Activity & { activityIds?: string[] })) =>
        id && addEventsToCategories({ id, name, isFlow: !!activityIds, isHidden }),
    );
  }

  const {
    scheduleExportTableData = [],
    scheduleExportCsv = [],
    calendarEventsArr = [],
    eventsDataArr = [],
  } = eventsData ?? {};

  useEffect(() => {
    if (calendarEventsArr) {
      dispatch(calendarEvents.actions.setCalendarEvents({ events: calendarEventsArr }));
    }
  }, [calendarEventsArr]);

  useEffect(() => {
    if (eventsDataArr) {
      dispatch(calendarEvents.actions.setCreateEventsData(eventsDataArr));
    }
  }, [eventsDataArr]);

  return {
    alwaysAvailableEvents,
    scheduledEvents,
    deactivatedEvents,
    scheduleExportTableData,
    scheduleExportCsv,
  };
};
