import { waitFor, screen } from '@testing-library/react';
import Router from 'react-router';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ManagersRemoveAccessPopup } from './ManagersRemoveAccessPopup';

const refetchManagersMock = jest.fn();
const onCloseMock = jest.fn();

const appletId = 'c0b1de97';
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
  test('ManagersRemoveAccessPopup should appear second screen', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ appletId });
    renderWithProviders(
      <ManagersRemoveAccessPopup
        onClose={onCloseMock}
        removeAccessPopupVisible={true}
        refetchManagers={refetchManagersMock}
        user={user}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByText(`${user.firstName} ${user.lastName} (${user.email})`),
      ).toBeInTheDocument(),
    );
  });
});
