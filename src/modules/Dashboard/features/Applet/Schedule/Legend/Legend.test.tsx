// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';
import * as utils from 'shared/utils';
import { JEST_TEST_TIMEOUT } from 'shared/consts';

import { Legend } from './Legend';

const dataTestid = 'dashboard-calendar-schedule-legend';
const defaultRoute = `/dashboard/${mockedAppletId}/schedule`;
const individualRoute = `/dashboard/${mockedAppletId}/schedule/'c48b275d-db4b-4f79-8469-9198b45985d3'`;
const defaultRoutePath = page.appletSchedule;
const individualRoutePath = page.appletScheduleIndividual;
const legendEvents = {
  alwaysAvailableEvents: [
    {
      id: '147fb738-5f3d-432f-b686-d6919f445795',
      name: 'Activity 1',
      isFlow: false,
      colors: ['#0b6e99', '#0b6e99'],
    },
  ],
  scheduledEvents: [
    {
      id: '41dcd5f3-03c8-4aea-a3b0-3e493cff3dda',
      name: 'Activity 2',
      isFlow: false,
      count: 1,
      colors: ['#0f7b6c', 'rgba(15, 123, 108, 0.3)'],
    },
  ],
  deactivatedEvents: [],
  scheduleExportTableData: [
    {
      activityName: {
        value: 'Activity 1',
      },
      date: {
        value: '09 Apr 2024',
      },
      startTime: {
        value: '-',
      },
      endTime: {
        value: '-',
      },
      notificationTime: {
        value: '-',
      },
      frequency: {
        value: 'Always',
      },
    },
    {
      activityName: {
        value: 'Activity 2',
      },
      date: {
        value: '11 Apr 2024',
      },
      startTime: {
        value: '00:00',
      },
      endTime: {
        value: '23:59',
      },
      notificationTime: {
        value: '-',
      },
      frequency: {
        value: 'Weekly',
      },
    },
  ],
  scheduleExportCsv: [
    {
      activityName: 'Activity 1',
      date: '09 Apr 2024',
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
    },
    {
      activityName: 'Activity 2',
      date: '11 Apr 2024',
      startTime: '00:00',
      endTime: '23:59',
      notificationTime: '-',
      frequency: 'Weekly',
    },
  ],
};

const preloadedState = {
  users: {
    allRespondents: {
      data: [
        {
          id: 'c48b275d-db4b-4f79-8469-9198b45985d3',
          nicknames: ['Jane Doe'],
          secretIds: ['409974a6-c36f-4e10-8fe3-5e555f664c17'],
          isAnonymousRespondent: false,
          lastSeen: '2024-04-09T13:35:14.980000',
          isPinned: false,
          details: [
            {
              appletId: '53ce3c84-88bb-458c-ab71-10500d94c596',
              appletDisplayName: 'Mocked Applet',
              appletImage: '',
              accessId: 'b3efe254-9149-4465-89c9-01ab37e3e57e',
              respondentNickname: 'Jane Doe',
              respondentSecretId: '409974a6-c36f-4e10-8fe3-5e555f664c17',
              hasIndividualSchedule: true,
              encryption: {},
            },
          ],
        },
      ],
    },
  },
};

jest.mock('shared/components', () => ({
  ...jest.requireActual('shared/components'),
  Table: () => <div>table component</div>,
}));

jest.mock('shared/utils', () => ({
  ...jest.requireActual('shared/utils'),
  exportTemplate: jest.fn(),
}));

describe('Legend', () => {
  test(
    'should render legend for default schedule',
    async () => {
      utils.renderWithProviders(
        <Legend legendEvents={legendEvents} appletName="Mock applet" appletId={mockedAppletId} />,
        {
          route: defaultRoute,
          routePath: defaultRoutePath,
        },
      );

      expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
      const schedule = screen.getByTestId(`${dataTestid}-schedule`);
      expect(schedule).toBeInTheDocument();
      expect(schedule).toHaveTextContent('Default Schedule​');

      const scheduleInput = schedule.querySelector('input');
      expect(scheduleInput).toBeInTheDocument();
      expect(scheduleInput).toHaveValue('defaultSchedule'); // selected default schedule

      const importButton = screen.getByTestId(`${dataTestid}-import`);
      expect(importButton).toBeInTheDocument();
      expect(importButton).toHaveTextContent('Import');

      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');

      const scheduled = screen.getByTestId(`${dataTestid}-scheduled`);
      expect(scheduled).toBeInTheDocument();
      expect(scheduled).toHaveTextContent('Scheduled');

      const clearAllScheduledEventsButton = screen.getByTestId(`${dataTestid}-scheduled-0`);
      const hideFromCalendarButton = screen.getByTestId(`${dataTestid}-scheduled-1`);
      expect(clearAllScheduledEventsButton).toBeInTheDocument();
      expect(hideFromCalendarButton).toBeInTheDocument();

      // test clear all scheduled events popup
      await userEvent.click(clearAllScheduledEventsButton);
      expect(screen.getByTestId(`${dataTestid}-clear-scheduled-events-popup`)).toBeInTheDocument();
      const closeClearScheduledEventsPopupButton = screen.getByTestId(
        `${dataTestid}-clear-scheduled-events-popup-close-button`,
      );
      expect(closeClearScheduledEventsPopupButton).toBeInTheDocument();
      await userEvent.click(closeClearScheduledEventsPopupButton);
      expect(
        screen.queryByTestId(`${dataTestid}-clear-scheduled-events-popup`),
      ).not.toBeInTheDocument();

      // test import popup
      await userEvent.click(importButton);
      expect(screen.getByTestId(`${dataTestid}-import-schedule-popup`)).toBeInTheDocument();
      const closeImportPopupButton = screen.getByTestId(
        `${dataTestid}-import-schedule-popup-close-button`,
      );
      expect(closeImportPopupButton).toBeInTheDocument();
      await userEvent.click(closeImportPopupButton);
      expect(screen.queryByTestId(`${dataTestid}-import-schedule-popup`)).not.toBeInTheDocument();

      // test export popup
      await userEvent.click(exportButton);
      expect(screen.getByTestId(`${dataTestid}-export-default-schedule-popup`)).toBeInTheDocument();
      const closeExportPopupButton = screen.getByTestId(
        `${dataTestid}-export-default-schedule-popup-close-button`,
      );
      expect(closeExportPopupButton).toBeInTheDocument();
      await userEvent.click(closeExportPopupButton);
      expect(
        screen.queryByTestId(`${dataTestid}-export-default-schedule-popup`),
      ).not.toBeInTheDocument();
    },
    JEST_TEST_TIMEOUT,
  );

  test(
    'should render legend for individual schedule',
    async () => {
      utils.renderWithProviders(
        <Legend legendEvents={legendEvents} appletName="Mock applet" appletId={mockedAppletId} />,
        {
          route: individualRoute,
          routePath: individualRoutePath,
          preloadedState,
        },
      );

      expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
      const schedule = screen.getByTestId(`${dataTestid}-schedule`);
      expect(schedule).toBeInTheDocument();
      expect(schedule).toHaveTextContent('Individual Schedule​');

      // test create event
      const createEvent = screen.getByTestId(`${dataTestid}-scheduled-item-0`);
      expect(createEvent).toBeInTheDocument();
      expect(createEvent).toHaveTextContent('Create Event');
      await userEvent.click(createEvent.firstChild);
      expect(screen.getByTestId(`${dataTestid}-create-event-popup`)).toBeInTheDocument();
      const createEventCloseButton = screen.getByTestId(
        `${dataTestid}-create-event-popup-close-button`,
      );
      expect(createEventCloseButton).toBeInTheDocument();
      await userEvent.click(createEventCloseButton);
      expect(screen.queryByTestId(`${dataTestid}-create-event-popup`)).not.toBeInTheDocument();

      // test remove individual schedule popup
      const individualRemoveButton = screen.getByTestId(`${dataTestid}-individual-remove`);
      expect(individualRemoveButton).toBeInTheDocument();
      await userEvent.click(individualRemoveButton);
      expect(
        screen.getByTestId(`${dataTestid}-remove-individual-schedule-popup`),
      ).toBeInTheDocument();
      const individualRemoveCloseButton = screen.getByTestId(
        `${dataTestid}-remove-individual-schedule-popup-close-button`,
      );
      expect(individualRemoveCloseButton).toBeInTheDocument();
      await userEvent.click(individualRemoveCloseButton);
      expect(
        screen.queryByTestId(`${dataTestid}-remove-individual-schedule-popup`),
      ).not.toBeInTheDocument();

      const scheduleInput = schedule.querySelector('input');
      expect(scheduleInput).toBeInTheDocument();
      expect(scheduleInput).toHaveValue('individualSchedule'); // selected individual schedule

      const importButton = screen.getByTestId(`${dataTestid}-import`);
      expect(importButton).toBeInTheDocument();
      expect(importButton).toHaveTextContent('Import');

      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');

      // test export popup
      await userEvent.click(exportButton);
      expect(
        screen.getByTestId(`${dataTestid}-export-individual-schedule-popup`),
      ).toBeInTheDocument();
      const submitButton = screen.getByTestId(
        `${dataTestid}-export-individual-schedule-popup-submit-button`,
      );
      expect(submitButton).toBeInTheDocument();
      await userEvent.click(submitButton);
      expect(utils.exportTemplate).toHaveBeenCalledWith({
        data: legendEvents.scheduleExportCsv,
        defaultData: null,
        fileName: '_schedule',
      });
      const closeExportPopupButton = screen.getByTestId(
        `${dataTestid}-export-individual-schedule-popup-close-button`,
      );
      expect(closeExportPopupButton).toBeInTheDocument();
      await userEvent.click(closeExportPopupButton);
      expect(
        screen.queryByTestId(`${dataTestid}-export-individual-schedule-popup`),
      ).not.toBeInTheDocument();

      // test search popup
      const search = screen.getByTestId(`${dataTestid}-individual-search`);
      expect(search).toBeInTheDocument();
      await userEvent.click(search);
      expect(screen.getByTestId(`${dataTestid}-individual-search-popup`)).toBeInTheDocument();
      await userEvent.click(
        screen.getByTestId(`${dataTestid}-individual-search-popup-close-button`),
      );
      expect(screen.queryByTestId(`${dataTestid}-individual-search-popup`)).not.toBeInTheDocument();
    },
    JEST_TEST_TIMEOUT,
  );
});
