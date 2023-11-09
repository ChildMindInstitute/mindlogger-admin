import { screen } from '@testing-library/react';
import { format } from 'date-fns';

import { base } from 'shared/state/Base';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedEmail,
  mockedInvitation,
} from 'shared/mock';
import { DateFormats, Roles } from 'shared/consts';
import { renderWithProviders } from 'shared/utils';
import { page } from 'resources';

import { InvitationsTable } from './InvitationsTable';
import { InvitationsTableProps } from './InvitationsTable.types';

const initialStateData = {
  ...base.state,
  data: null,
};

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

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

const defaultProps: InvitationsTableProps = {
  invitations: mockedInvitation,
  setInvitations: jest.fn(),
};

describe('InvitationsTable', () => {
  test('Render empty InvitationsTable', () => {
    renderWithProviders(<InvitationsTable invitations={null} setInvitations={jest.fn()} />, {
      preloadedState,
      route,
      routePath,
    });

    expect(screen.queryByTestId('dashboard-add-users-table')).not.toBeInTheDocument();
    expect(screen.getByText(/No pending invitations/)).toBeInTheDocument();
  });

  test('InvitationsTable for Editor', () => {
    renderWithProviders(<InvitationsTable {...defaultProps} />, {
      preloadedState,
      route,
      routePath,
    });

    const tableColumnNames = [
      'Secret User ID',
      'First Name',
      'Last Name',
      'Role',
      'Email',
      'Invitation Link',
      'Date & Time Invited',
    ];

    const invitationColumns = [
      'Jane',
      'Doe',
      'Editor',
      mockedEmail,
      '/invitation/e6fdab42-412d-312c-a1e6-a6ee3a72a777',
      `${format(
        new Date('2023-11-02T08:37:13.652256Z'),
        DateFormats.YearMonthDayHoursMinutesSeconds,
      )}`,
    ];

    expect(screen.getByTestId('dashboard-add-users-table')).toBeInTheDocument();
    tableColumnNames.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
    invitationColumns.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
  });
});
