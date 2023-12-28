import { fireEvent, screen, waitFor } from '@testing-library/react';
import { addDays } from 'date-fns';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletId, mockedCurrentWorkspace, mockedApplet } from 'shared/mock';
import { SettingParam, renderWithProviders } from 'shared/utils';

import { ExportDataSetting } from './ExportDataSetting';
import { ExportDateType } from './ExportDataSettings.types';

const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.ExportData}`;
const routePath = page.appletSettingsItem;

const dateString = '2023-11-14T14:43:33.369902';
const date = new Date(dateString);

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: dateString } },
    },
  },
};

const dataTestid = 'applet-settings-export-data-export';

describe('ExportDataSetting', () => {
  describe('should appear export data popup for date range', () => {
    test.each`
      exportDataType              | description
      ${ExportDateType.Last24h}   | ${'last 24h'}
      ${ExportDateType.LastMonth} | ${'last month'}
      ${ExportDateType.LastWeek}  | ${'last week'}
      ${ExportDateType.AllTime}   | ${'all time'}
    `('$description', async ({ exportDataType }) => {
      renderWithProviders(<ExportDataSetting />, { preloadedState, route, routePath });
      const dateType = screen.getByTestId(`${dataTestid}-dateType`);
      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: exportDataType } });

      fireEvent.click(screen.getByText('Download'));

      await waitFor(() => expect(screen.getByTestId(`${dataTestid}-popup-password`)).toBeVisible());
    });
  });

  describe('should appear export data popup for \'choose dates\' date range', () => {
    test.each`
      route                                                                 | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.ExportData}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.ExportData}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      renderWithProviders(<ExportDataSetting />, { preloadedState, route, routePath });
      const dateType = screen.getByTestId(`${dataTestid}-dateType`);
      expect(dateType).toBeVisible();
      expect(screen.getByTestId(dataTestid)).toBeVisible();

      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: ExportDateType.ChooseDates } });

      const fromDate = screen.getByTestId(`${dataTestid}-from-date`);
      const fromDateInput = fromDate.querySelector('input');
      const toDate = screen.getByTestId(`${dataTestid}-to-date`);
      const toDateInput = toDate.querySelector('input');
      expect(fromDate).toBeVisible();
      expect(fromDateInput?.value).toBe('14 Nov 2023');
      expect(toDate).toBeVisible();
      expect(toDateInput?.value).toBe('27 Dec 2023');

      fromDateInput && fireEvent.change(fromDateInput, { target: { value: addDays(date, 1) } });
      toDateInput && fireEvent.change(toDateInput, { target: { value: addDays(date, -1) } });

      fireEvent.click(screen.getByText('Download'));

      await waitFor(() => expect(screen.getByTestId(`${dataTestid}-popup-password`)).toBeVisible());
    });
  });
});
