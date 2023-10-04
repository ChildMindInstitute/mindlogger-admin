import { fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';

import { LinkGenerator } from './LinkGenerator';

const response = {
  data: {
    result: {
      requireLogin: true,
      link: 'inviteId',
    },
  },
};
const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

const fakeRequest = () => new Promise((res) => res(response));

describe('LinkGenerator component tests', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('LinkGenerator should generate link', async () => {
    jest.spyOn(mockedAxios, 'post').mockImplementation(fakeRequest);

    renderWithProviders(<LinkGenerator />, {
      route,
      routePath,
    });

    fireEvent.click(screen.getByTestId('dashboard-add-users-generate-link-generate'));
    await waitFor(() =>
      expect(
        screen.getByTestId('dashboard-add-users-generate-link-generate-popup'),
      ).toBeInTheDocument(),
    );
    await waitFor(() => fireEvent.click(screen.getByText('Yes, account is required')));
    await waitFor(() =>
      expect(screen.getByTestId('dashboard-add-users-generate-link-url')).toBeInTheDocument(),
    );
  });

  test('LinkGenerator should get link', async () => {
    jest.spyOn(mockedAxios, 'get').mockImplementation(fakeRequest);

    renderWithProviders(<LinkGenerator />, {
      route,
      routePath,
    });

    await waitFor(() =>
      expect(screen.getByTestId('dashboard-add-users-generate-link-url')).toBeInTheDocument(),
    );
  });
});
