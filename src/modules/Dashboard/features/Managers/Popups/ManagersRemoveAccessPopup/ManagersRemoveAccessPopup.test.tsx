import { waitFor, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';

import { ManagersRemoveAccessPopup } from './ManagersRemoveAccessPopup';

const refetchManagersMock = jest.fn();
const onCloseMock = jest.fn();

const route = `/dashboard/${mockedAppletId}/managers`;
const routePath = page.appletManagers;
const user = {
  id: '1',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email@gmail.com',
  lastSeen: '',
  roles: [],
  applets: [],
};

describe('ManagersRemoveAccessPopup component tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('ManagersRemoveAccessPopup should appear second screen', async () => {
    renderWithProviders(
      <ManagersRemoveAccessPopup
        onClose={onCloseMock}
        removeAccessPopupVisible={true}
        refetchManagers={refetchManagersMock}
        user={user}
      />,
      {
        route,
        routePath,
      },
    );

    await waitFor(() =>
      expect(
        screen.getByText(`${user.firstName} ${user.lastName} (${user.email})`),
      ).toBeInTheDocument(),
    );
  });
});
