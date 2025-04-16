import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { mockedAppletId, mockedCurrentWorkspace, mockedEmail } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { initialStateData } from 'shared/state';
import { Roles } from 'shared/consts';

import { TransferOwnership } from './TransferOwnership';

const mockedSetIsSubmitted = vi.fn();
const mockedSetEmailTransferred = vi.fn();
const dataTestid = 'transfer-ownership';

const transferOwnershipComponent = (
  <TransferOwnership
    appletId={mockedAppletId}
    setIsSubmitted={mockedSetIsSubmitted}
    setEmailTransferred={mockedSetEmailTransferred}
    isSubmitted={true}
    data-testid={dataTestid}
  />
);

describe('TransferOwnership', () => {
  test('renders without errors', () => {
    renderWithProviders(transferOwnershipComponent);
  });

  test('not transfers ownership on form submission with invalid email', async () => {
    renderWithProviders(transferOwnershipComponent);
    await userEvent.type(screen.getByLabelText(/Email/i), 'invalid@email{enter}');

    const error = await screen.findByText('Email must be valid');
    expect(error).toBeInTheDocument();
  });

  test('transfers ownership on form submission with valid email', async () => {
    renderWithProviders(transferOwnershipComponent);
    await userEvent.type(screen.getByLabelText(/Owner email/i), `${mockedEmail}{enter}`);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/applets/${mockedAppletId}/transferOwnership`,
        { email: mockedEmail },
        { signal: undefined },
      );
    });
  });

  test('shows ArbitraryWarningPopup if there is arbitrary server in Workspace', async () => {
    const preloadedState = {
      workspaces: {
        workspaces: initialStateData,
        currentWorkspace: {
          ...initialStateData,
          data: {
            ...mockedCurrentWorkspace.data,
            useArbitrary: true,
          },
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
    renderWithProviders(transferOwnershipComponent, { preloadedState });
    await userEvent.type(screen.getByLabelText(/Email/i), `${mockedEmail}{enter}`);

    expect(screen.getByTestId('arbitrary-warning-popup')).toBeInTheDocument();
    expect(mockAxios.post).not.toHaveBeenCalled();
  });
});
