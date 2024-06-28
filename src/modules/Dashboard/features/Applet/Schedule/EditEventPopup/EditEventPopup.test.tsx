// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'redux/modules';
import { applets } from 'modules/Dashboard/state';
import { mockedCurrentWorkspace } from 'shared/mock';
import { page } from 'resources';
import { JEST_TEST_TIMEOUT } from 'shared/consts';

import { EditEventPopup } from './EditEventPopup';

const mockAppletId = 'a341e3d7-0170-4894-8823-798c58456130';
const mockEventId1 = '8a0a2abd-d8e2-4fb6-91bb-65aecfc5396a';
const mockEventId2 = 'ae1d9534-ad9b-4efc-a0c7-cd82addc44fc';

export const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
  },
  calendarEvents: {
    createEventsData: {
      data: [
        {
          activityOrFlowId: '96d889e2-2264-4e76-8c60-744600e770fe',
          eventId: mockEventId1,
          activityOrFlowName: 'Mock Activity 1',
          periodicityType: 'WEEKLY',
          selectedDate: '2024-03-18',
          startDate: '2024-03-18',
          endDate: '2024-12-31',
          startTime: '10:00:00',
          endTime: '12:00:00',
          isAlwaysAvailable: false,
          colors: ['#0b6e99', 'rgba(11, 110, 153, 0.3)'],
          flowId: null,
          nextYearDateString: null,
          currentYear: 2024,
          oneTimeCompletion: null,
          accessBeforeSchedule: false,
          timerType: 'NOT_SET',
          timer: null,
          notification: null,
        },
        {
          activityOrFlowId: '60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0',
          eventId: mockEventId2,
          activityOrFlowName: 'Mock Activity 2',
          periodicityType: 'ALWAYS',
          selectedDate: '2024-03-18',
          startDate: null,
          endDate: null,
          startTime: '00:00:00',
          endTime: '23:59:00',
          isAlwaysAvailable: true,
          colors: ['#0b6e99', 'rgba(11, 110, 153, 0.3)'],
          flowId: null,
          nextYearDateString: null,
          currentYear: 2024,
          oneTimeCompletion: false,
          accessBeforeSchedule: null,
          timerType: 'NOT_SET',
          timer: null,
          notification: null,
        },
      ],
    },
  },
  applet: {
    applet: {
      data: {
        result: {
          displayName: 'Mock Applet',
          description: 'Applet Description...',
          id: mockAppletId,
          version: '3.0.0',
          createdAt: '2024-02-13T18:10:20.530872',
          updatedAt: '2024-03-05T18:58:21.012829',
          activities: [
            {
              name: 'Mock Activity 1',
              description: 'Activity Description...',
              id: '96d889e2-2264-4e76-8c60-744600e770fe',
              createdAt: '2024-03-05T18:58:21.029663',
            },
            {
              name: 'Mock Activity 2',
              description: 'Activity Description...',
              id: '60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0',
              createdAt: '2024-03-05T19:20:21.029663',
            },
          ],
        },
      },
    },
  },
};

describe('EditEventPopup', () => {
  const mockSetEditEventPopupVisible = jest.fn();
  const mockSetSaveChangesPopupVisible = jest.fn();

  const dataTestid = 'dashboard-calendar-edit-event';
  const mockDefaultStartDate = new Date('03-18-2024');
  const mockEditedEvent1 = {
    activityOrFlowId: '96d889e2-2264-4e76-8c60-744600e770fe',
    eventId: mockEventId1,
    title: 'Mock Activity 1',
    alwaysAvailable: false,
    startFlowIcon: false,
    isHidden: false,
    backgroundColor: 'transparent',
    periodicity: 'WEEKLY',
    eventStart: new Date('2024-03-18T09:00:00.000Z'),
    eventEnd: new Date('2024-12-31T11:00:00.000Z'),
    oneTimeCompletion: null,
    accessBeforeSchedule: false,
    timerType: 'NOT_SET',
    timer: null,
    notification: null,
    endAlertIcon: false,
    allDay: false,
    scheduledColor: '#0b6e99',
    scheduledBackground: 'rgba(11, 110, 153, 0.3)',
    startTime: '10:00',
    endTime: '12:00',
    id: 'event-4559',
    start: new Date('2024-03-18T09:00:00.000Z'),
    end: new Date('2024-03-18T11:00:00.000Z'),
    eventCurrentDate: '18 Mar 2024',
    isHiddenInTimeView: false,
    isOffRange: false,
  };
  const mockEditedEvent2 = {
    activityOrFlowId: '60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0',
    eventId: mockEventId2,
    title: 'Mock Activity 2',
    alwaysAvailable: true,
    startFlowIcon: false,
    isHidden: false,
    backgroundColor: '#0b6e99',
    periodicity: 'ALWAYS',
    eventStart: new Date('2023-11-05T23:00:00.000Z'),
    eventEnd: null,
    oneTimeCompletion: false,
    accessBeforeSchedule: false,
    timerType: 'NOT_SET',
    timer: 0,
    notification: null,
    endAlertIcon: false,
    allDay: true,
    startTime: '00:00',
    endTime: '23:59',
    id: 'event-5837',
    start: new Date('2024-03-18T23:00:00.000Z'),
    end: new Date('2024-03-18T22:59:00.000Z'),
    eventCurrentDate: '18 Mar 2024',
    isHiddenInTimeView: false,
    isOffRange: false,
  };

  test(
    'update event periodicity and test close edit event popup',
    async () => {
      renderWithProviders(
        <EditEventPopup
          open
          editedEvent={mockEditedEvent1}
          setEditEventPopupVisible={mockSetEditEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
          setSaveChangesPopupVisible={mockSetSaveChangesPopupVisible}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(`${dataTestid}-popup`)).toBeInTheDocument();
      const title = screen.getByTestId(`${dataTestid}-popup-title`);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Edit Activity Schedule');

      const submitButton = screen.getByTestId(`${dataTestid}-popup-submit-button`);
      expect(submitButton).toBeDisabled();

      // change event periodicity
      const daily = screen.getByTestId(`${dataTestid}-popup-form-availability-periodicity-1`);
      await userEvent.click(daily);

      // test close edit event popup
      const closeButton = await screen.findByTestId(`${dataTestid}-popup-close-button`);
      expect(closeButton).toBeInTheDocument();

      await userEvent.click(closeButton);
      expect(mockSetSaveChangesPopupVisible).toBeCalledWith(true);
      expect(mockSetEditEventPopupVisible).not.toBeCalled();
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'update event periodicity (WEEKLY -> DAILY)',
    async () => {
      renderWithProviders(
        <EditEventPopup
          open
          editedEvent={mockEditedEvent1}
          setEditEventPopupVisible={mockSetEditEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
          setSaveChangesPopupVisible={mockSetSaveChangesPopupVisible}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(`${dataTestid}-popup`)).toBeInTheDocument();
      const title = screen.getByTestId(`${dataTestid}-popup-title`);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Edit Activity Schedule');

      const submitButton = screen.getByTestId(`${dataTestid}-popup-submit-button`);
      expect(submitButton).toBeDisabled();

      // change event periodicity
      const daily = screen.getByTestId(`${dataTestid}-popup-form-availability-periodicity-1`);
      await userEvent.click(daily);

      expect(mockSetEditEventPopupVisible).toBeCalledWith(false);

      expect(submitButton).not.toBeDisabled();
      await userEvent.click(submitButton);

      expect(mockAxios.put).toBeCalledWith(
        `/applets/${mockAppletId}/events/${mockEventId1}`,
        {
          accessBeforeSchedule: false,
          endTime: '12:00:00',
          notification: null,
          periodicity: {
            endDate: '2024-12-31',
            startDate: '2024-03-18',
            type: 'DAILY',
          },
          startTime: '10:00:00',
          timer: undefined,
          timerType: 'NOT_SET',
        },
        { signal: undefined },
      );
      expect(mockSetEditEventPopupVisible).toBeCalledWith(false);
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'event removal',
    async () => {
      mockAxios.delete.mockResolvedValueOnce(null);
      const spyGetEvents = jest.spyOn(applets.thunk, 'getEvents');

      renderWithProviders(
        <EditEventPopup
          open
          editedEvent={mockEditedEvent1}
          setEditEventPopupVisible={mockSetEditEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(`${dataTestid}-popup`)).toBeInTheDocument();
      const removeButton = screen.getByTestId(`${dataTestid}-popup-remove`);
      expect(removeButton).toBeInTheDocument();
      expect(removeButton).toHaveTextContent('Remove Event');
      await userEvent.click(removeButton);

      const removePopup = screen.getByTestId(`${dataTestid}-remove-scheduled-event-popup`);
      expect(removePopup).toBeInTheDocument();
      const removePopupTitle = screen.getByTestId(
        `${dataTestid}-remove-scheduled-event-popup-title`,
      );
      expect(removePopupTitle).toBeInTheDocument();
      expect(removePopupTitle).toHaveTextContent('Remove Scheduled Event');

      // test close popup
      const closeButton = screen.getByTestId(
        `${dataTestid}-remove-scheduled-event-popup-close-button`,
      );
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      expect(mockSetEditEventPopupVisible).toHaveBeenCalledWith(true);
      await userEvent.click(removeButton);
      expect(removePopup).toHaveTextContent(
        /Are you sure you want to remove this scheduled event for Mock Activity?/,
      );
      const removePopupConfirmButton = screen.getByTestId(
        `${dataTestid}-remove-scheduled-event-popup-submit-button`,
      );
      expect(removePopupConfirmButton).toBeInTheDocument();
      await userEvent.click(removePopupConfirmButton);

      await waitFor(() => {
        expect(mockAxios.delete).toBeCalledWith(`/applets/${mockAppletId}/events/${mockEventId1}`, {
          signal: undefined,
        });
      });

      expect(spyGetEvents).toHaveBeenCalledWith({
        appletId: mockAppletId,
        respondentId: undefined,
      });
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'change availability (scheduled access -> always available) and test warning popup',
    async () => {
      renderWithProviders(
        <EditEventPopup
          open
          editedEvent={mockEditedEvent1}
          setEditEventPopupVisible={mockSetEditEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(`${dataTestid}-popup`)).toBeInTheDocument();
      const alwaysAvailable = await screen.findByTestId(
        `${dataTestid}-popup-form-availability-always-available`,
      );
      expect(alwaysAvailable).toBeInTheDocument();
      expect(alwaysAvailable.querySelector('input')).toHaveValue('false');

      // change to "always available"
      const select = alwaysAvailable.querySelectorAll('.MuiSelect-select')[0];
      await userEvent.click(select);
      await userEvent.click((await screen.findByRole('listbox')).querySelectorAll('li')[0]);
      expect(
        screen.getByText(
          /Once you set this event to always available, all scheduled events for this activity will be removed./,
        ),
      ).toBeInTheDocument();
      const submitButton = screen.getByTestId(`${dataTestid}-popup-submit-button`);
      await userEvent.click(submitButton);

      const removeAllEventsPopupDataTestid = `${dataTestid}-remove-all-scheduled-events-popup`;
      const removePopup = screen.getByTestId(removeAllEventsPopupDataTestid);
      expect(removePopup).toBeInTheDocument();
      const removePopupTitle = screen.getByTestId(`${removeAllEventsPopupDataTestid}-title`);
      expect(removePopupTitle).toBeInTheDocument();
      expect(removePopupTitle).toHaveTextContent('Remove All Scheduled Events for Activity');

      // test close popup
      const closeButton = screen.getByTestId(`${removeAllEventsPopupDataTestid}-close-button`);
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      expect(mockSetEditEventPopupVisible).toHaveBeenCalledWith(true);
      await userEvent.click(submitButton);

      expect(removePopup).toHaveTextContent(
        /All scheduled events for Mock Activity 1 will be removed, and the activity will become always available to the user. Are you sure you want to continue?/,
      );
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      const removeButton = screen.getByRole('button', { name: 'Remove' });
      expect(removeButton).toBeInTheDocument();
      await userEvent.click(removeButton);

      expect(mockAxios.put).toBeCalledWith(
        `/applets/${mockAppletId}/events/${mockEventId1}`,
        {
          endTime: '23:59:00',
          notification: null,
          oneTimeCompletion: false,
          periodicity: {
            selectedDate: '2024-03-18',
            type: 'ALWAYS',
          },
          startTime: '00:00:00',
          timer: undefined,
          timerType: 'NOT_SET',
        },
        { signal: undefined },
      );
      expect(mockSetEditEventPopupVisible).toBeCalledWith(false);
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'change availability (always available -> scheduled access) and test warning popup',
    async () => {
      renderWithProviders(
        <EditEventPopup
          open
          editedEvent={mockEditedEvent2}
          setEditEventPopupVisible={mockSetEditEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(`${dataTestid}-popup`)).toBeInTheDocument();
      const alwaysAvailable = await screen.findByTestId(
        `${dataTestid}-popup-form-availability-always-available`,
      );
      expect(alwaysAvailable).toBeInTheDocument();
      expect(alwaysAvailable.querySelector('input')).toHaveValue('true');

      // change to "scheduled access"
      const select = alwaysAvailable.querySelectorAll('.MuiSelect-select')[0];
      await userEvent.click(select);
      await userEvent.click((await screen.findByRole('listbox')).querySelectorAll('li')[1]);
      expect(
        screen.getByText(
          /Once you schedule this event, the Activity will no longer be always available./,
        ),
      ).toBeInTheDocument();
      const submitButton = screen.getByTestId(`${dataTestid}-popup-submit-button`);
      await userEvent.click(submitButton);

      const scheduledAccessPopupDataTestid = 'dashboard-calendar-confirm-scheduled-access-popup';
      const confirmScheduledPopup = screen.getByTestId(scheduledAccessPopupDataTestid);
      expect(confirmScheduledPopup).toBeInTheDocument();
      const confirmScheduledPopupTitle = screen.getByTestId(
        `${scheduledAccessPopupDataTestid}-title`,
      );
      expect(confirmScheduledPopupTitle).toBeInTheDocument();
      expect(confirmScheduledPopupTitle).toHaveTextContent('Confirm Scheduled Access');

      // test close popup
      const closeButton = screen.getByTestId(`${scheduledAccessPopupDataTestid}-close-button`);
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      expect(mockSetEditEventPopupVisible).toHaveBeenCalledWith(true);
      await userEvent.click(submitButton);
      expect(confirmScheduledPopup).toHaveTextContent(
        /Activity Mock Activity 2 will no longer be always available, and the Activity will be a scheduled event. Are you sure you want to continue?/,
      );
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      expect(confirmButton).toBeInTheDocument();
      await userEvent.click(confirmButton);

      expect(mockAxios.put).toBeCalledWith(
        `/applets/${mockAppletId}/events/${mockEventId2}`,
        {
          accessBeforeSchedule: false,
          endTime: '23:59:00',
          notification: null,
          periodicity: {
            selectedDate: '2024-03-18',
            type: 'ONCE',
          },
          startTime: '00:00:00',
          timer: undefined,
          timerType: 'NOT_SET',
        },
        { signal: undefined },
      );
      expect(mockSetEditEventPopupVisible).toBeCalledWith(false);
    },
    JEST_TEST_TIMEOUT,
  );
});
