import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as encryptionFunctions from 'shared/utils/encryption';
import { mockedApplet, mockedPassword } from 'shared/mock';

import { DeletePopup } from '.';

const testId = 'dashboard-applets-delete';
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
    renderWithProviders(<DeletePopup onCloseCallback={onCloseMock} data-testid={testId} />, {
      preloadedState,
    });

    expect(screen.getByTestId(`${testId}-enter-password-popup-password`)).toBeInTheDocument();
  });

  test('DeletePopup should open success modal', async () => {
    mockAxios.delete.mockResolvedValueOnce(null);
    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPublicKey: getPublicKeyMock,
      }),
    );

    renderWithProviders(<DeletePopup onCloseCallback={onCloseMock} data-testid={testId} />, {
      preloadedState,
    });

    fireEvent.change(screen.getByLabelText(/Password/), {
      target: { value: mockedPassword },
    });
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() =>
      expect(screen.getByText('Applet has been deleted successfully.')).toBeInTheDocument(),
    );
  });
});
