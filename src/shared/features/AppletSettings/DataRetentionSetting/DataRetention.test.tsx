import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { expectBanner, SettingParam } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { initialStateData } from 'shared/state/Base';
import { Roles } from 'shared/consts';
import { page } from 'resources';
import { RetentionPeriods } from 'shared/types';

import { DataRetention } from './DataRetention';

const route = `/dashboard/${mockedAppletId}/settings/${SettingParam.DataRetention}`;
const routePath = page.appletSettingsItem;
const getPreloadedState = (
  retentionPeriod?: number | null,
  retentionType?: RetentionPeriods | null,
) => ({
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
      data: { result: { ...mockedApplet, retentionPeriod, retentionType } },
    },
  },
});
const dataTestid = 'applet-settings-data-retention';

describe('DataRetention component tests', () => {
  test('should render with default values', () => {
    const { container } = renderWithProviders(<DataRetention isDashboard />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    expect(container.querySelector('form')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-retention-type`)).toBeInTheDocument();
    const retentionTypeInput = container.querySelector('input');
    expect(retentionTypeInput?.value).toBe('indefinitely');
  });

  test('should render with applet retention type and period', () => {
    const { container } = renderWithProviders(<DataRetention isDashboard />, {
      preloadedState: getPreloadedState(2, RetentionPeriods.Days),
      route,
      routePath,
    });
    const [retentionPeriodInput, retentionTypeInput] = container.querySelectorAll('input');

    expect(screen.getByTestId(`${dataTestid}-retention-period`)).toBeInTheDocument();
    expect(retentionPeriodInput?.value).toBe('2');
    expect(retentionTypeInput?.value).toBe(RetentionPeriods.Days);
  });

  test('should appear retention period after choosing retention type with default value', async () => {
    const { container } = renderWithProviders(<DataRetention isDashboard />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    const retentionTypeInput = container.querySelector('input');
    retentionTypeInput &&
      fireEvent.change(retentionTypeInput, { target: { value: RetentionPeriods.Months } });

    await waitFor(() => {
      expect(screen.getByTestId(`${dataTestid}-retention-period`)).toBeInTheDocument();
      expect(container.querySelector('input')?.value).toBe('1');
    });
  });

  test('should successfully save changes', async () => {
    mockAxios.post.mockResolvedValueOnce(null);
    const { container, store } = renderWithProviders(<DataRetention isDashboard />, {
      preloadedState: getPreloadedState(),
      route,
      routePath,
    });

    const retentionPeriod = 1;
    const retentionType = RetentionPeriods.Weeks;
    const retentionTypeInput = container.querySelector('input');
    retentionTypeInput &&
      fireEvent.change(retentionTypeInput, { target: { value: retentionType } });
    await userEvent.click(screen.getByTestId(`${dataTestid}-save`));

    expect(mockAxios.post).nthCalledWith(
      1,
      `/applets/${mockedAppletId}/retentions`,
      { period: retentionPeriod, retention: retentionType },
      { signal: undefined },
    );
    expectBanner(store, 'SaveSuccessBanner');
  });

  test('comma input testing', async () => {
    const { container } = renderWithProviders(<DataRetention isDashboard />, {
      preloadedState: getPreloadedState(2, RetentionPeriods.Days),
      route,
      routePath,
    });
    const [retentionPeriodInput] = container.querySelectorAll('input');

    expect(screen.getByTestId(`${dataTestid}-retention-period`)).toBeInTheDocument();
    await userEvent.type(retentionPeriodInput, ',');
    expect(retentionPeriodInput?.value).toBe('2');
  });
});
