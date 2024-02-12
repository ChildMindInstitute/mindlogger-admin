import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { page } from 'resources';
import { initialStateData } from 'shared/state';

import { AddUserForm } from '.';

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: initialStateData,
    workspacesRoles: initialStateData,
  },
};
const mockedWorkspaceInfo = {
  data: {
    result: {
      hasManagers: false,
    },
  },
};

const mockedGetInvitationsHandler = () => jest.fn();

describe('AddUserForm component tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('AddUserForm should appear respondents and workspace name when select reviewer', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedWorkspaceInfo);

    renderWithProviders(<AddUserForm getInvitationsHandler={mockedGetInvitationsHandler} />, {
      preloadedState,
      route,
      routePath,
    });

    const selectWrapper = screen.getByTestId('dashboard-add-users-role').childNodes[1].childNodes[0];
    await userEvent.click(selectWrapper as Element);
    const optionsWrapper = await screen.findByRole('listbox');

    await userEvent.click(within(optionsWrapper).getByText(/reviewer/i));

    const respondents = await screen.findByLabelText('Respondents');
    expect(respondents).toBeInTheDocument();
    const addUserWorkspace = await screen.findByTestId('dashboard-add-users-workspace');
    expect(addUserWorkspace).toBeInTheDocument();
  });
});
