// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';
import * as useAsyncHooks from 'shared/hooks/useAsync/useAsync';

import { ManagersRemoveAccessPopup } from '.';

const refetchManagersMock = vi.fn();
const onCloseMock = vi.fn();

const dataTestid = 'dashboard-managers-remove-access-popup';
const routeWithAppletId = `/dashboard/${mockedAppletId}/managers`;
const routePathWithAppletId = page.appletManagers;
const routeWithoutAppletId = '/dashboard/managers';
const routePathWithoutAppletId = page.dashboardManagers;
const user = {
  id: '1',
  firstName: 'firstName',
  lastName: 'lastName',
  title: 'PhD',
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

    expect(screen.getByText(user.applets[0].displayName)).toBeInTheDocument();
  });

  test('ManagersRemoveAccessPopup should remove access with appletId', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);

    renderWithProviders(<ManagersRemoveAccessPopup {...commonProps} />, {
      route: routeWithAppletId,
      routePath: routePathWithAppletId,
    });

    const backButton = screen.queryByRole('button', {
      name: 'Back',
    });
    expect(backButton).not.toBeInTheDocument();

    await userEvent.click(screen.getByText('Remove'));
    expect(screen.getByText('Ok')).toBeInTheDocument();
  });

  test('ManagersRemoveAccessPopup should remove access without appletId', async () => {
    const useAsyncSpy = jest.spyOn(useAsyncHooks, 'useAsync');
    const mockExecute = vi.fn();
    useAsyncSpy.mockImplementation(() => ({
      execute: mockExecute,
      setError: vi.fn(),
      error: 'Error message',
    }));

    renderWithProviders(<ManagersRemoveAccessPopup {...commonProps} />, {
      route: routeWithoutAppletId,
      routePath: routePathWithoutAppletId,
    });

    // step 1
    expect(
      screen.queryByRole('button', {
        name: 'Back',
      }),
    ).not.toBeInTheDocument();

    const removeAccessButton = screen.getByRole('button', {
      name: 'Remove Access',
    });
    expect(removeAccessButton).toBeDisabled();

    const checkbox = screen.getByTestId(`${dataTestid}-checkbox-0`);
    const input = checkbox.querySelector('input') as HTMLInputElement;

    await userEvent.click(input);
    expect(removeAccessButton).not.toBeDisabled();

    await userEvent.click(removeAccessButton);

    // step 2
    expect(
      screen.getByRole('button', {
        name: 'Back',
      }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Remove',
      }),
    );

    expect(mockExecute).toHaveBeenCalledWith({
      appletIds: ['2e46fa32-ea7c-4a76-b49b-1c97d795bb9a'],
      userId: '1',
    });

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
