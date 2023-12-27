import { fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils';
import { mockedApplet, mockedAppletData, mockedPassword } from 'shared/mock';
import * as encryptionFunctions from 'shared/utils/encryption';
import * as builderHooks from 'modules/Builder/hooks';

import { DuplicatePopups } from './DuplicatePopups';

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

jest.mock('modules/Builder/hooks', () => ({
  ...jest.requireActual('modules/Builder/hooks'),
  useAppletPrivateKeySetter: jest.fn(),
}));

describe('DuplicatePopups', () => {
  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('should show an error if the name already exists in database', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name (1)' } } });

    const { getByTestId, getByText } = renderWithProviders(<DuplicatePopups />, {
      preloadedState,
    });

    await waitFor(() => {
      expect(getByTestId('dashboard-applets-duplicate-popup-name')).toBeInTheDocument();
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => expect(getByText(/That applet name already exists/)).toBeInTheDocument());
  });

  test('should duplicate and open success modal', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: mockedAppletData } });
    jest.spyOn(encryptionFunctions, 'getEncryptionToServer').mockReturnValue(mockedEncryption);
    jest.spyOn(builderHooks, 'useAppletPrivateKeySetter').mockReturnValue(() => jest.fn());

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
