import { waitFor, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { page } from 'resources';
import { base } from 'shared/state/Base';

import { AddUserForm } from '.';

const initialStateData = {
  ...base.state,
  data: null,
};
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
    const selectWrapper = screen.getByTestId('dashboard-add-users-role').childNodes[1]
      .childNodes[0];
    userEvent.click(selectWrapper as Element);
    const optionsWrapper = await waitFor(() => screen.findByRole('listbox'));
    userEvent.click(within(optionsWrapper).getByText(/reviewer/i));
    await waitFor(() => {
      expect(screen.getByLabelText('Respondents')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-add-users-workspace')).toBeInTheDocument();
    });
  });
});
