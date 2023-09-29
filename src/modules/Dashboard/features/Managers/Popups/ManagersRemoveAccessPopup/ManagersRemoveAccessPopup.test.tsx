import { waitFor, screen, fireEvent } from '@testing-library/react';
import Router from 'react-router';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ManagersRemoveAccessPopup } from '.';

const refetchManagersMock = jest.fn();
const onCloseMock = jest.fn();
const fakeRequest = () => new Promise((res) => res(null));

const appletId = 'c0b1de97';
const user = {
  id: '1',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email@gmail.com',
  lastSeen: '',
  roles: [],
  applets: [{ displayName: 'displayName', id: appletId, roles: [] }],
};
const commonProps = {
  onClose: onCloseMock,
  popupVisible: true,
  refetchManagers: refetchManagersMock,
  user,
};

describe('ManagersRemoveAccessPopup component tests', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('ManagersRemoveAccessPopup should open with applets list', async () => {
    renderWithProviders(<ManagersRemoveAccessPopup {...commonProps} />);

    await waitFor(() => expect(screen.getByText(user.applets[0].displayName)).toBeInTheDocument());
  });

  test('ManagersRemoveAccessPopup should remove access with appletId', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ appletId });
    jest.spyOn(mockedAxios, 'delete').mockImplementation(fakeRequest);

    renderWithProviders(<ManagersRemoveAccessPopup {...commonProps} />);

    fireEvent.click(screen.getByText('Remove'));
    await waitFor(() => expect(screen.getByText('Ok')).toBeInTheDocument());
  });
});
