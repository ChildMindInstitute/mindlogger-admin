import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedOwnerId,
  mockedRespondentId,
  mockedRespondent,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import { ApiResponseCodes } from 'api';

import { Respondents } from './Respondents';

const route = `/dashboard/${mockedAppletId}/respondents`;
const routePath = page.appletRespondents;
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
      data: { result: mockedApplet },
    },
  },
};

const getMockedGetWithRespondents = (isAnonymousRespondent = false) => ({
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: isAnonymousRespondent
      ? [{ ...mockedRespondent, isAnonymousRespondent: true }]
      : [mockedRespondent],
    count: 1,
  },
});

const clickActionDots = async () => {
  const actionsDots = await waitFor(() =>
    screen.getByTestId('dashboard-respondents-table-actions-dots'),
  );
  fireEvent.click(actionsDots);
};

describe('Respondents component tests', () => {
  test('should render empty table', async () => {
    const successfulGetMock = {
      status: ApiResponseCodes.SuccessfulResponse,
      data: null,
    };
    mockAxios.get.mockResolvedValueOnce(successfulGetMock);
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });

    await waitFor(() => {
      expect(screen.getByText(/No Respondents yet/)).toBeInTheDocument();
    });
  });

  test('should render no permission table', async () => {
    const mockedGet = {
      payload: {
        response: {
          status: ApiResponseCodes.Forbidden,
          data: null,
        },
      },
    };
    mockAxios.get.mockResolvedValue(mockedGet);
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });

    await waitFor(() => {
      expect(screen.getByText('You have no permissions to view this tab.')).toBeInTheDocument();
    });
  });

  test('should render table with respondents', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithRespondents());
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });
    const tableColumnNames = ['ID', 'Nickname', 'Last active', 'Schedule', 'Actions'];
    const respondentColumns = ['mockedSecretId', 'Mocked Respondent', 'Schedule'];

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-respondents-table')).toBeInTheDocument();
      tableColumnNames.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
      respondentColumns.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
    });
  });

  test('should pin respondent', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithRespondents());
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });

    const respondentPin = await waitFor(() => screen.getByTestId('dashboard-respondents-pin'));
    fireEvent.click(respondentPin);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/workspaces/${mockedOwnerId}/respondents/${mockedRespondentId}/pin`,
        {},
        { signal: undefined },
      );
    });
  });

  test('should appear respondents actions on respondent actions button click', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithRespondents());
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });

    await clickActionDots();
    const actionsDataTestIds = [
      'dashboard-respondents-view-calendar',
      'dashboard-respondents-view-data',
      'dashboard-respondents-export-data',
      'dashboard-respondents-edit',
      'dashboard-respondents-remove-access',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  test('should appear actions for anonymous respondent', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithRespondents(true));
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });

    await clickActionDots();

    const actionsDataTestIds = [
      'dashboard-respondents-view-data',
      'dashboard-respondents-export-data',
      'dashboard-respondents-edit',
      'dashboard-respondents-remove-access',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  describe('should appear popup when click on respondent action for ', () => {
    test.each`
      actionDataTestId                         | popupDataTestId                                       | description
      ${'dashboard-respondents-view-data'}     | ${'dashboard-respondents-view-data-popup'}            | ${'view data'}
      ${'dashboard-respondents-view-calendar'} | ${'dashboard-respondents-view-calendar-popup'}        | ${'view calendar'}
      ${'dashboard-respondents-export-data'}   | ${'dashboard-respondents-export-data-popup-password'} | ${'export data'}
      ${'dashboard-respondents-edit'}          | ${'dashboard-respondents-edit-popup'}                 | ${'edit respondents'}
      ${'dashboard-respondents-remove-access'} | ${'dashboard-respondents-remove-access-popup'}        | ${'remove access'}
    `('$description', async ({ actionDataTestId, popupDataTestId }) => {
      mockAxios.get.mockResolvedValue(getMockedGetWithRespondents());
      renderWithProviders(<Respondents />, { preloadedState, route, routePath });

      await clickActionDots();
      const action = await waitFor(() => screen.getByTestId(actionDataTestId));
      fireEvent.click(action);

      await waitFor(() => {
        expect(screen.getByTestId(popupDataTestId)).toBeInTheDocument();
      });
    });
  });

  test('should search respondents', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithRespondents());
    renderWithProviders(<Respondents />, { preloadedState, route, routePath });
    const mockedSearchValue = 'mockedSearchValue';

    const search = await waitFor(() => screen.getByTestId('dashboard-respondents-search'));
    const searchInput = search.querySelector('input');
    searchInput && fireEvent.change(searchInput, { target: { value: mockedSearchValue } });

    await waitFor(() => {
      expect(mockAxios.get).toBeCalledWith(
        `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`,
        {
          params: {
            limit: 20,
            page: 1,
            search: mockedSearchValue,
          },
          signal: undefined,
        },
      );
    });
  });
});
