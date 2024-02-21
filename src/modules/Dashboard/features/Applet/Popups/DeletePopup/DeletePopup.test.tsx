import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import * as encryptionFunctions from 'shared/utils/encryption';
import { mockedApplet, mockedPassword } from 'shared/mock';
import { expectBanner, renderWithProviders } from 'shared/utils';
import * as useAsyncModule from 'shared/hooks/useAsync';

import { DeletePopup } from '.';

const dataTestid = 'dashboard-applets-delete';
const preloadedState = {
  popups: {
    data: {
      applet: mockedApplet,
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: true,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: false,
      publishConcealPopupVisible: false,
    },
  },
};

const getPublicKeyMock = () => Buffer.from(JSON.parse(mockedApplet?.encryption?.publicKey || ''));
const onCloseMock = jest.fn();

describe('DeletePopup', () => {
  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('DeletePopup should open the password check modal initially', async () => {
    renderWithProviders(<DeletePopup onCloseCallback={onCloseMock} data-testid={dataTestid} />, {
      preloadedState,
    });

    expect(screen.getByTestId(`${dataTestid}-enter-password-popup-password`)).toBeInTheDocument();
  });

  test('DeletePopup should show success banner', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPublicKey: getPublicKeyMock,
      }),
    );

    const { store } = renderWithProviders(
      <DeletePopup onCloseCallback={onCloseMock} data-testid={dataTestid} />,
      { preloadedState },
    );

    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: mockedPassword },
    });
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expectBanner(store, `${dataTestid}-success-banner`);
    });
  });

  test('renders NoPermissionPopup when noPermission is true', () => {
    jest.spyOn(useAsyncModule, 'useAsync').mockReturnValue({
      execute: jest.fn(),
      value: null,
      error: null,
      isLoading: false,
      setError: jest.fn(),
      noPermission: true,
      setNoPermission: jest.fn(),
    });

    const { getByTestId, getByText, queryByTestId } = renderWithProviders(
      <DeletePopup onCloseCallback={onCloseMock} data-testid={dataTestid} />,
    );

    expect(getByTestId(`${dataTestid}-no-permission-popup`)).toBeInTheDocument();

    const submitButton = getByText('Refresh');
    fireEvent.click(submitButton);

    expect(queryByTestId(`${dataTestid}-no-permission-popup`)).not.toBeInTheDocument();
  });
});
