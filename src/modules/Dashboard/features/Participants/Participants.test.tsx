import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';

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

import { Participants } from './Participants';

const route = `/dashboard/${mockedAppletId}/participants`;
const routePath = page.appletParticipants;
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

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

const getMockedGetWithParticipants = (isAnonymousRespondent = false) => ({
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
    screen.getByTestId('dashboard-participants-table-actions-dots'),
  );
  fireEvent.click(actionsDots);
};

describe('Participants component tests', () => {
  test('should render empty table', async () => {
    const successfulGetMock = {
      status: ApiResponseCodes.SuccessfulResponse,
      data: null,
    };
    mockAxios.get.mockResolvedValueOnce(successfulGetMock);
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await waitFor(() => {
      const result = screen.getByText(/No Participants yet/);
      expect(result).toBeInTheDocument();
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
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await waitFor(() => {
      expect(screen.getByText('You have no permissions to view this tab.')).toBeInTheDocument();
    });
  });

  test('should render table with participants', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });
    const tableColumnNames = ['ID', 'Nickname', 'Tag', 'Status', 'Latest Activity', 'Schedule'];
    const participantColumns = ['mockedSecretId', 'Mocked Respondent', 'Schedule'];

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-participants-table')).toBeInTheDocument();
      tableColumnNames.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
      participantColumns.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
    });
  });

  test('participant row should link to participant details page', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });
    const firstParticipantSecretIdCell = await waitFor(() =>
      screen.getByTestId('dashboard-participants-table-0-cell-secretIds'),
    );
    fireEvent.click(firstParticipantSecretIdCell);

    expect(mockedUseNavigate).toHaveBeenCalledWith(
      generatePath(page.appletParticipantActivities, {
        appletId: mockedAppletId,
        participantId: mockedRespondentId,
      }),
    );
  });

  test('should pin participant', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    const participantPin = await waitFor(() => screen.getByTestId('dashboard-participants-pin'));
    fireEvent.click(participantPin);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/workspaces/${mockedOwnerId}/respondents/${mockedRespondentId}/pin`,
        {},
        { signal: undefined },
      );
    });
  });

  test('participant actions should appear on participant actions button click', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await clickActionDots();
    const actionsDataTestIds = [
      'dashboard-participants-view-calendar',
      'dashboard-participants-view-data',
      'dashboard-participants-export-data',
      'dashboard-participants-edit',
      'dashboard-participants-remove-access',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  test('actions should appear for anonymous participant', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithParticipants(true));
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await clickActionDots();

    const actionsDataTestIds = [
      'dashboard-participants-view-data',
      'dashboard-participants-export-data',
      'dashboard-participants-edit',
      'dashboard-participants-remove-access',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  describe('popup should appear when click on participant action for ', () => {
    test.each`
      actionDataTestId                          | popupDataTestId                                        | description
      ${'dashboard-participants-view-data'}     | ${'dashboard-respondents-view-data-popup'}             | ${'view data'}
      ${'dashboard-participants-view-calendar'} | ${'dashboard-respondents-view-calendar-popup'}         | ${'view calendar'}
      ${'dashboard-participants-export-data'}   | ${'dashboard-participants-export-data-popup-password'} | ${'export data'}
      ${'dashboard-participants-edit'}          | ${'dashboard-respondents-edit-popup'}                  | ${'edit participants'}
      ${'dashboard-participants-remove-access'} | ${'dashboard-respondents-remove-access-popup'}         | ${'remove access'}
    `('$description', async ({ actionDataTestId, popupDataTestId }) => {
      mockAxios.get.mockResolvedValue(getMockedGetWithParticipants());
      renderWithProviders(<Participants />, { preloadedState, route, routePath });

      await clickActionDots();
      const action = await waitFor(() => screen.getByTestId(actionDataTestId));
      fireEvent.click(action);

      await waitFor(() => {
        expect(screen.getByTestId(popupDataTestId)).toBeInTheDocument();
      });
    });
  });

  test('should search participants', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });
    const mockedSearchValue = 'mockedSearchValue';

    const search = await waitFor(() => screen.getByTestId('dashboard-participants-search'));
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
