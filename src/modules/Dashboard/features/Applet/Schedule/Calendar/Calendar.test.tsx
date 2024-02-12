/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Suspense } from 'react';

import { fireEvent, act } from '@testing-library/react';
import { endOfDay, startOfDay } from 'date-fns';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import * as reduxHooks from 'redux/store/hooks';
import { initialStateData } from 'shared/state';
import { Periodicity } from 'modules/Dashboard/api';

import { dataTestId } from './Calendar.const';
import { Calendar } from './Calendar';

const route = `/dashboard/${mockedAppletId}/schedule`;
const routePath = page.appletSchedule;

const mockedEvent = {
  activityOrFlowId: '94040668-edf6-4c3f-8d89-d6b99ecbcdca',
  eventId: '56983aea-aa39-48de-bb0a-08804e834435',
  title: 'activity flow',
  alwaysAvailable: false,
  startFlowIcon: true,
  isHidden: false,
  backgroundColor: '#0f7b6c',
  periodicity: Periodicity.Daily,
  oneTimeCompletion: false,
  accessBeforeSchedule: false,
  timerType: 'NOT_SET',
  timer: 0,
  notification: null,
  endAlertIcon: false,
  allDay: true,
  startTime: '00:00',
  endTime: '23:59',
  eventCurrentDate: 'current date',
  isHiddenInTimeView: false,
  id: 'event-1',
  eventStart: startOfDay(new Date()),
  eventEnd: endOfDay(new Date()),
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

const preloadedState = {
  calendarEvents: {
    calendarCurrentYear: initialStateData,
    createEventsData: initialStateData,
    processedEvents: {
      ...initialStateData,
      data: {
        eventsToShow: [mockedEvent],
      },
    },
  },
};

describe('Calendar Component', () => {
  const mockDispatch = jest.fn();
  jest.mock('redux/store/hooks', () => ({
    useAppDispatch: jest.fn(),
  }));

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders calendar component with toolbar, month view visible, and provided event', () => {
    const { container, getByTestId } = renderWithProviders(<Calendar />, {
      preloadedState,
      route,
      routePath,
    });

    const calendarElement = getByTestId(dataTestId);
    expect(calendarElement).toBeInTheDocument();

    const calendarToolbar = getByTestId('schedule-calendar-current-date-toolbar');
    expect(calendarToolbar).toBeInTheDocument();

    const events = container.getElementsByClassName('rbc-event');
    expect(events.length).toBe(1);

    expect(container.getElementsByClassName('rbc-month-view').length).toBe(1);
  });

  test('opens create event popup on add button click', () => {
    const { getByTestId } = renderWithProviders(<Calendar />, {
      preloadedState,
      route,
      routePath,
    });

    const addButton = getByTestId(`${dataTestId}-create-event`);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    const createEventPopup = getByTestId(`${dataTestId}-create-event-popup`);
    expect(createEventPopup).toBeInTheDocument();
  });

  test('changes view on toolbar view button click', () => {
    const { container, getByTestId } = renderWithProviders(<Calendar />, {
      preloadedState,
      route,
      routePath,
    });

    const dayViewBtn = getByTestId('schedule-calendar-current-date-toolbar-view-mode-0');
    fireEvent.click(dayViewBtn);

    expect(container.getElementsByClassName('rbc-time-view').length).toBe(1);
  });

  test('changes current date on toolbar change date button click', () => {
    const { getByTestId } = renderWithProviders(<Calendar />, {
      preloadedState,
      route,
      routePath,
    });

    const nextBtn = getByTestId('schedule-calendar-current-date-toolbar-next');
    fireEvent.click(nextBtn);

    expect(getByTestId('schedule-calendar-current-date-toolbar-today')).toBeInTheDocument();
  });

  test('opens edit event popup on event click', async () => {
    const { container, findByTestId } = renderWithProviders(
      <Suspense fallback={<></>}>
        <Calendar />
      </Suspense>,
      {
        preloadedState,
        route,
        routePath,
      },
    );

    const eventElement = container.querySelector('.rbc-event');
    expect(eventElement).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(eventElement);
    });

    const editEventPopup = await findByTestId(`${dataTestId}-edit-event-popup`);
    expect(editEventPopup).toBeInTheDocument();
  });

  test('should dispatch setCalendarCurrentYear', async () => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    await act(async () => {
      renderWithProviders(<Calendar />, {
        preloadedState,
        route,
        routePath,
      });
    });

    expect(mockDispatch).nthCalledWith(1, {
      payload: expect.any(Object),
      type: 'calendarEvents/setCalendarCurrentYear',
    });
  });
});
