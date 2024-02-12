import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';

import { LinkGenerator } from './LinkGenerator';

const mockedResponse = {
  data: {
    result: {
      requireLogin: true,
      link: 'inviteId',
    },
  },
};
const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

describe('LinkGenerator component tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('LinkGenerator should generate link', async () => {
    mockAxios.post.mockResolvedValueOnce(mockedResponse);

    renderWithProviders(<LinkGenerator />, {
      route,
      routePath,
    });

    fireEvent.click(screen.getByTestId('dashboard-add-users-generate-link-generate'));
    await waitFor(() =>
      expect(screen.getByTestId('dashboard-add-users-generate-link-generate-popup')).toBeInTheDocument(),
    );
    await waitFor(() => fireEvent.click(screen.getByText('Yes, account is required')));
    await waitFor(() => expect(screen.getByTestId('dashboard-add-users-generate-link-url')).toBeInTheDocument());
  });

  test('LinkGenerator should get link', async () => {
    mockAxios.get.mockResolvedValueOnce(mockedResponse);

    renderWithProviders(<LinkGenerator />, {
      route,
      routePath,
    });

    await waitFor(() => expect(screen.getByTestId('dashboard-add-users-generate-link-url')).toBeInTheDocument());
  });
});
