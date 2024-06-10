// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'redux/modules';
import { mockedCurrentWorkspace } from 'shared/mock';
import { page } from 'resources';
import { JEST_TEST_TIMEOUT } from 'shared/consts';

import { CreateEventPopup } from './CreateEventPopup';

const mockSetCreateEventPopupVisible = jest.fn();
const dataTestid = 'dashboard-calendar-create-event-popup';
const mockDefaultStartDate = new Date('03-18-2024');
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

describe('CreateEventPopup', () => {
  test(
    'create new event for WEEKLY event',
    async () => {
      renderWithProviders(
        <CreateEventPopup
          open
          setCreateEventPopupVisible={mockSetCreateEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
          data-testid={dataTestid}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(dataTestid)).toBeInTheDocument();
      const title = await screen.findByTestId(`${dataTestid}-title`);
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Create Activity Schedule');

      // test close create event popup
      const closeButton = await screen.findByTestId(`${dataTestid}-close-button`);
      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      expect(mockSetCreateEventPopupVisible).toBeCalledWith(false);

      // test save event without selected activity
      const saveButton = await screen.findByTestId(`${dataTestid}-submit-button`);
      expect(saveButton).not.toBeDisabled();
      await userEvent.click(saveButton);
      expect(screen.getByText('Activity is required')).toBeInTheDocument();

      // select activity
      const activityContainer = screen.getByTestId(`${dataTestid}-form-activity`);
      const activityInput = activityContainer.querySelector('input');
      expect(activityInput).toHaveValue('');
      const select = activityContainer.querySelector('.MuiSelect-select');
      await userEvent.click(select);
      const listbox = await screen.findByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(listbox.querySelectorAll('li')).toHaveLength(2); // 2 mock activity
      await userEvent.click(listbox.querySelectorAll('li')[0]);
      expect(activityInput).toHaveValue('96d889e2-2264-4e76-8c60-744600e770fe'); // selected the 1st activity
      await userEvent.click(saveButton);

      const removeEventsPopupDataTestid = `${dataTestid}-remove-all-scheduled-events-popup`;
      const removePopup = await screen.findByTestId(removeEventsPopupDataTestid);
      expect(removePopup).toBeInTheDocument();

      // test close remove all scheduled events popup
      const removePopupCloseButton = screen.getByTestId(
        `${removeEventsPopupDataTestid}-close-button`,
      );
      expect(removePopupCloseButton).toBeInTheDocument();
      await userEvent.click(removePopupCloseButton);
      expect(removePopup).not.toBeInTheDocument();
      await userEvent.click(saveButton);

      const removePopupTitle = screen.getByTestId(`${removeEventsPopupDataTestid}-title`);
      expect(removePopupTitle).toBeInTheDocument();
      expect(removePopupTitle).toHaveTextContent('Remove All Scheduled Events for Activity');
      expect(removePopup).toHaveTextContent(
        /All scheduled events for Mock Activity 1 will be removed, and the activity will become always available to the user. Are you sure you want to continue?/,
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      const removeButton = screen.getByRole('button', { name: 'Remove' });
      expect(removeButton).toBeInTheDocument();
      await userEvent.click(removeButton);

      expect(mockAxios.post).toBeCalledWith(
        `/applets/${mockAppletId}/events`,
        {
          activityId: '96d889e2-2264-4e76-8c60-744600e770fe',
          endTime: '23:59:00',
          notification: null,
          oneTimeCompletion: false,
          periodicity: {
            selectedDate: '2024-03-18',
            type: 'ALWAYS',
          },
          respondentId: undefined,
          startTime: '00:00:00',
          timer: undefined,
          timerType: 'NOT_SET',
        },
        { signal: undefined },
      );
      expect(mockSetCreateEventPopupVisible).toBeCalledWith(false);
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'create new event for ALWAYS event',
    async () => {
      renderWithProviders(
        <CreateEventPopup
          open
          setCreateEventPopupVisible={mockSetCreateEventPopupVisible}
          defaultStartDate={mockDefaultStartDate}
          data-testid={dataTestid}
        />,
        {
          preloadedState,
          route: `/dashboard/${mockAppletId}/schedule`,
          routePath: page.appletSchedule,
        },
      );

      expect(await screen.findByTestId(dataTestid)).toBeInTheDocument();

      // select activity
      const activityContainer = screen.getByTestId(`${dataTestid}-form-activity`);
      const activityInput = activityContainer.querySelector('input');
      expect(activityInput).toHaveValue('');
      const select = activityContainer.querySelector('.MuiSelect-select');
      expect(select).toBeInTheDocument();
      await userEvent.click(select);

      const listbox = await screen.findByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(listbox.querySelectorAll('li')).toHaveLength(2); // 2 mock activity
      await userEvent.click(listbox.querySelectorAll('li')[1]); // selected the 2nd activity
      expect(activityInput).toHaveValue('60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0');
      const saveButton = screen.getByTestId(`${dataTestid}-submit-button`);
      await userEvent.click(saveButton);

      const accessPopup = screen.getByTestId('dashboard-calendar-confirm-scheduled-access-popup');
      expect(accessPopup).toBeInTheDocument();
      const accessPopupTitle = screen.getByTestId(
        'dashboard-calendar-confirm-scheduled-access-popup-title',
      );
      expect(accessPopupTitle).toBeInTheDocument();
      expect(accessPopupTitle).toHaveTextContent('Confirm Scheduled Access');
      expect(accessPopup).toHaveTextContent(
        /Activity Mock Activity 2 will no longer be always available, and the Activity will be a scheduled event. Are you sure you want to continue?/,
      );

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      expect(confirmButton).toBeInTheDocument();
      await userEvent.click(confirmButton);

      expect(mockAxios.post).toBeCalledWith(
        `/applets/${mockAppletId}/events`,
        {
          accessBeforeSchedule: false,
          activityId: '60f83cbf-8ffe-447b-af34-0e4cc5f8d3d0',
          endTime: '23:59:00',
          notification: null,
          periodicity: {
            selectedDate: '2024-03-18',
            type: 'ONCE',
          },
          respondentId: undefined,
          startTime: '00:00:00',
          timer: undefined,
          timerType: 'NOT_SET',
        },
        { signal: undefined },
      );
      expect(mockSetCreateEventPopupVisible).toBeCalledWith(false);
    },
    JEST_TEST_TIMEOUT,
  );
});
