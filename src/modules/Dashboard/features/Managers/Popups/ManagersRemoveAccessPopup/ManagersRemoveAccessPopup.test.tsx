import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ManagersRemoveAccessPopup } from '.';

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
  applets: [{ displayName: 'displayName', id: mockedAppletId, roles: [] }],
};
const commonProps = {
  onClose: onCloseMock,
  popupVisible: true,
  refetchManagers: refetchManagersMock,
  user,
};

describe('ManagersRemoveAccessPopup component tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('ManagersRemoveAccessPopup should open with applets list', async () => {
    renderWithProviders(<ManagersRemoveAccessPopup {...commonProps} />);

    await waitFor(() => expect(screen.getByText(user.applets[0].displayName)).toBeInTheDocument());
  });

  test('ManagersRemoveAccessPopup should remove access with appletId', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);

    renderWithProviders(<ManagersRemoveAccessPopup {...commonProps} />, {
      route,
      routePath,
    });

    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => expect(screen.getByText('Ok')).toBeInTheDocument());
  });
});
