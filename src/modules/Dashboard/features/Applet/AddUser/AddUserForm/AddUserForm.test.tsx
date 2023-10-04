import { waitFor, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';

import { AddUserForm } from '.';

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

const mockedGetInvitationsHandler = () => jest.fn();

describe('AddUserForm component tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('AddUserForm should appear respondents select for reviewer', async () => {
    renderWithProviders(<AddUserForm getInvitationsHandler={mockedGetInvitationsHandler} />, {
      route,
      routePath,
    });

    const select = screen.getByTestId('dashboard-add-users-role').childNodes[1].childNodes[0];

    userEvent.click(select as Element);
    const optionsPopupEl = await waitFor(() => screen.findByRole('listbox'));
    userEvent.click(within(optionsPopupEl).getByText(/reviewer/i));
    await waitFor(() => expect(screen.getByLabelText('Respondents')).toBeInTheDocument());
  });
});
