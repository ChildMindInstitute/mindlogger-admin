import { fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import { mockedApplet, mockedPassword } from 'shared/mock';
import * as encryptionFunctions from 'shared/utils/encryption';

import { DuplicatePopups } from '.';

const preloadedState = {
  popups: {
    data: {
      applet: mockedApplet,
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: false,
      duplicatePopupsVisible: true,
      transferOwnershipPopupVisible: false,
      publishConcealPopupVisible: false,
    },
  },
};
const mockedEncryption = {
  publicKey: '[47]',
  prime: '[145]',
  base: '[2]',
  accountId: '12345',
};

describe('DuplicatePopups', () => {
  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('should duplicate and open success modal', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce(null);
    jest.spyOn(encryptionFunctions, 'getEncryptionToServer').mockReturnValue(mockedEncryption);

    const { getByTestId, getByLabelText, getByText } = renderWithProviders(<DuplicatePopups />, {
      preloadedState,
    });

    await waitFor(() => {
      expect(getByTestId('dashboard-applets-duplicate-popup-name')).toBeInTheDocument();
      fireEvent.click(getByText('Submit'));
    });
    await waitFor(() => {
      fireEvent.change(getByLabelText('Password'), {
        target: { value: mockedPassword },
      });
      fireEvent.change(getByLabelText('Repeat the password'), {
        target: { value: mockedPassword },
      });
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => expect(getByText(/has been duplicated successfully/)).toBeInTheDocument());
  });

  // TODO uncomment after useasync changes
  // test('should open error modal', async () => {
  //   mockAxios.post.mockRejectedValue(new Error('error'));

  //   const { getByText } = renderWithProviders(<DuplicatePopups />, {
  //     preloadedState,
  //   });

  //   await waitFor(() =>
  //     expect(getByText('Applet has not been duplicated. Please try again.')).toBeInTheDocument(),
  //   );
  // });
});
