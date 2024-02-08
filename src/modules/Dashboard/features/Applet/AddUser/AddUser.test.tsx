import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { page } from 'resources';
import { Roles } from 'shared/consts';
import { mockedAppletId, mockedEmail, mockedCurrentWorkspace } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { AddUser } from './AddUser';

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;
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
    workspacesRoles: initialStateData,
  },
};
const mockedInvitations = [
  {
    meta: {
      secret_user_id: '123123',
    },
    email: mockedEmail,
    firstName: 'Name',
    lastName: 'LastName',
    role: 'manager',
    createdAt: '2023-10-06 13:11:31',
  },
];

describe('AddUser component tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('AddUser should submit form and get invitations', async () => {
    let callCount = 0;
    mockAxios.post.mockResolvedValueOnce(null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mockAxios.get.mockImplementation((url: string) => {
      if (url === '/invitations') {
        callCount += 1;
        if (callCount === 2) {
          return Promise.resolve({ data: { result: mockedInvitations } });
        }
      }

      return;
    });

    renderWithProviders(<AddUser />, {
      preloadedState,
      route,
      routePath,
    });

    const [invitation] = mockedInvitations;

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: invitation.firstName },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: invitation.lastName },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: invitation.email },
    });
    fireEvent.change(screen.getByLabelText('Secret User ID'), {
      target: { value: invitation.meta.secret_user_id },
    });
    fireEvent.click(screen.getByText('Send Invitation'));
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-add-users-table')).toBeInTheDocument();
      expect(screen.getByText(invitation.firstName)).toBeInTheDocument();
    });
  });
});
