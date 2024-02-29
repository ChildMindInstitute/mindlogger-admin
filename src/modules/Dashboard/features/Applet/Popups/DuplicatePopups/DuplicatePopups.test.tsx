import { fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { expectBanner, renderWithProviders } from 'shared/utils';
import { mockedApplet, mockedAppletData, mockedPassword } from 'shared/mock';
import * as encryptionFunctions from 'shared/utils/encryption';

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

const dataTestid = 'dashboard-applets-duplicate-popup';

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
      expect(getByTestId(`${dataTestid}-name`)).toBeInTheDocument();
      fireEvent.click(getByText('Submit'));
    });

    await waitFor(() => expect(getByText(/That Applet name already exists/)).toBeInTheDocument());
  });

  test('should duplicate and open success modal', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: mockedAppletData });
    jest
      .spyOn(encryptionFunctions, 'getEncryptionToServer')
      .mockReturnValue(Promise.resolve(mockedEncryption));
    jest.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPrivateKey: () => [],
      }),
    );

    const { getByTestId, getByLabelText, getByText, store } = renderWithProviders(
      <DuplicatePopups />,
      {
        preloadedState,
      },
    );

    await waitFor(() => {
      expect(getByTestId(`${dataTestid}-name`)).toBeInTheDocument();
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

    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));
    await waitFor(() => {
      expect(
        store.getState().banners.data.banners.find((payload) => {
          const bannerContent = payload.bannerProps?.children;
          if (bannerContent) {
            return bannerContent.toString().includes(mockedAppletData.displayName);
          }

          return false;
        }),
      ).toBeDefined();
    });
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
