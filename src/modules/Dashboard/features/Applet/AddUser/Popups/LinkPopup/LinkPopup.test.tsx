import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';

import { LinkPopup } from './LinkPopup';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;

describe('LinkPopup', () => {
  test('should generate link with required account', async () => {
    const result = { link: 'link', requireLogin: true };
    mockAxios.post.mockResolvedValueOnce({ data: { result } });
    renderWithProviders(<LinkPopup open={true} onClose={onCloseMock} onSubmit={onSubmitMock} />, {
      route,
      routePath,
    });

    expect(screen.getByTestId('dashboard-add-users-generate-link-generate-popup')).toBeVisible();
    expect(screen.getByText('Do you want to require the respondent to create an account?')).toBeVisible();

    fireEvent.click(screen.getByText('Yes, account is required'));

    expect(mockAxios.post).toBeCalledWith(
      '/applets/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/access_link',
      { requireLogin: true },
      { signal: undefined },
    );
    await waitFor(() => expect(onSubmitMock).toBeCalledWith(result));
    expect(onCloseMock).toBeCalled();
  });

  test('should generate link without required account', async () => {
    const result = { link: 'link', requireLogin: false };
    mockAxios.post.mockResolvedValueOnce({ data: { result } });
    renderWithProviders(<LinkPopup open={true} onClose={onCloseMock} onSubmit={onSubmitMock} />, {
      route,
      routePath,
    });

    expect(screen.getByTestId('dashboard-add-users-generate-link-generate-popup')).toBeVisible();
    expect(screen.getByText('Do you want to require the respondent to create an account?')).toBeVisible();

    fireEvent.click(screen.getByText('No, account is not required'));

    expect(mockAxios.post).toBeCalledWith(
      '/applets/2e46fa32-ea7c-4a76-b49b-1c97d795bb9a/access_link',
      { requireLogin: false },
      { signal: undefined },
    );
    await waitFor(() => expect(onSubmitMock).toBeCalledWith(result));
    expect(onCloseMock).toBeCalled();
  });
});
