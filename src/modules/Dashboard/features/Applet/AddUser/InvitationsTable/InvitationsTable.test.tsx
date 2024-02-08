import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';

import { page } from 'resources';
import { DateFormats, Roles } from 'shared/consts';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace, mockedEmail, mockedInvitation } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils';

import { InvitationsTable } from './InvitationsTable';
import { dataTestId } from './InvitationsTable.const';
import { InvitationsTableProps } from './InvitationsTable.types';

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

    expect(screen.queryByTestId(dataTestId)).not.toBeInTheDocument();
    expect(screen.getByText(/No pending invitations/)).toBeInTheDocument();
  });

  test('InvitationsTable for Editor, render copy link tooltip on invitation link click, close tooltip on click outside', async () => {
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
      `${process.env.REACT_APP_WEB_URI || ''}/invitation/e6fdab42-412d-312c-a1e6-a6ee3a72a777`,
      `${format(new Date('2023-11-02T08:37:13.652256Z'), DateFormats.YearMonthDayHoursMinutesSeconds)}`,
    ];

    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
    tableColumnNames.forEach(column => expect(screen.getByText(column)).toBeInTheDocument());
    invitationColumns.forEach(column => expect(screen.getByText(column)).toBeInTheDocument());

    const invitationLink = screen.getByTestId(`${dataTestId}-invitation-link`);
    expect(invitationLink).toBeInTheDocument();
    await userEvent.click(invitationLink);
    expect(screen.getByTestId(`${dataTestId}-invitation-tooltip`)).toBeInTheDocument();
    await userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.queryByTestId(`${dataTestId}-invitation-tooltip`)).not.toBeInTheDocument();
    });
  });
});
