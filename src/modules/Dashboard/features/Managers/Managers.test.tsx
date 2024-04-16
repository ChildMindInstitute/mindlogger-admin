import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedOwnerId,
  mockedManager,
  mockedEmail,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import { ApiResponseCodes } from 'api';

import { Managers } from './Managers';

const route = `/dashboard/${mockedAppletId}/managers`;
const routePath = page.appletManagers;
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

const getMockedGetWithManagers = (isOwner = false) => ({
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: isOwner ? [{ ...mockedManager, id: mockedOwnerId }] : [mockedManager],
    count: 1,
  },
});

const clickActionDots = async () => {
  const actionsDots = await waitFor(() =>
    screen.getByTestId('dashboard-managers-table-actions-dots'),
  );
  fireEvent.click(actionsDots);
};

describe('Managers component tests', () => {
  test('should render empty table', async () => {
    const successfulGetMock = {
      status: ApiResponseCodes.SuccessfulResponse,
      data: null,
    };
    mockAxios.get.mockResolvedValueOnce(successfulGetMock);
    renderWithProviders(<Managers />, { preloadedState, route, routePath });

    await waitFor(() => {
      expect(screen.getByText(/No Managers yet/)).toBeInTheDocument();
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
    renderWithProviders(<Managers />, { preloadedState, route, routePath });

    await waitFor(() => {
      expect(screen.getByText('You have no permissions to view this tab.')).toBeInTheDocument();
    });
  });

  test('should render table with managers', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithManagers());
    renderWithProviders(<Managers />, { preloadedState, route, routePath });
    const tableColumnNames = ['First Name', 'Last Name', 'Title', 'Role', 'Email'];
    const managersColumns = ['TestFirstName', 'TestLastName', mockedEmail, 'Reviewer'];

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-managers-table')).toBeInTheDocument();
      tableColumnNames.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
      managersColumns.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
    });
  });

  test('should appear managers actions for reviewer', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithManagers());
    renderWithProviders(<Managers />, { preloadedState, route, routePath });

    await clickActionDots();
    const actionsDataTestIds = ['dashboard-managers-edit-user', 'dashboard-managers-remove-access'];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  test('should not appear managers actions for owner', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithManagers(true));
    renderWithProviders(<Managers />, { preloadedState, route, routePath });

    await waitFor(() =>
      expect(screen.queryByTestId('dashboard-managers-table-actions-dots')).not.toBeInTheDocument(),
    );
  });

  describe('should appear popup when click on manager action for ', () => {
    test.each`
      actionDataTestId                      | popupDataTestId                             | description
      ${'dashboard-managers-edit-user'}     | ${'dashboard-managers-edit-access-popup'}   | ${'edit access'}
      ${'dashboard-managers-remove-access'} | ${'dashboard-managers-remove-access-popup'} | ${'remove access'}
    `('$description', async ({ actionDataTestId, popupDataTestId }) => {
      mockAxios.get.mockResolvedValue(getMockedGetWithManagers());
      renderWithProviders(<Managers />, { preloadedState, route, routePath });

      await clickActionDots();
      const action = await waitFor(() => screen.getByTestId(actionDataTestId));
      fireEvent.click(action);

      await waitFor(() => {
        expect(screen.getByTestId(popupDataTestId)).toBeInTheDocument();
      });
    });
  });

  test('should search managers', async () => {
    const emptySearchGetMock = {
      status: ApiResponseCodes.SuccessfulResponse,
      data: {
        result: [],
        count: 0,
      },
    };

    mockAxios.get.mockResolvedValueOnce(getMockedGetWithManagers());
    mockAxios.get.mockResolvedValueOnce(emptySearchGetMock);
    renderWithProviders(<Managers />, { preloadedState, route, routePath });
    const mockedSearchValue = 'mockedSearchValue';

    const search = await waitFor(() => screen.getByTestId('dashboard-managers-search'));
    const searchInput = search.querySelector('input');
    searchInput && fireEvent.change(searchInput, { target: { value: mockedSearchValue } });

    await waitFor(() => {
      expect(mockAxios.get).toBeCalledWith(
        `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`,
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

    await waitFor(() => {
      expect(screen.getByText(/No match was found/)).toBeInTheDocument();
    });
  });
});
