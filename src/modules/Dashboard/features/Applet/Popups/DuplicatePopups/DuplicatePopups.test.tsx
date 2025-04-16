import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import userEvent from '@testing-library/user-event';

import { expectBanner } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletData, mockedAppletId, mockedPassword } from 'shared/mock';
import * as encryptionFunctions from 'shared/utils/encryption';
import { mockGetRequestResponses } from 'shared/utils/axios-mocks';
import { SingleApplet } from 'shared/state';
import { applet } from 'redux/modules';

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

const abortSignal = { signal: undefined };

describe('DuplicatePopups', () => {
  afterEach(() => {
    mockAxios.reset();
    vi.restoreAllMocks();
  });

  test('should show an error if the name already exists in database', async () => {
    mockAxios.post.mockResolvedValueOnce({ data: { result: mockedAppletData } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name (1)' } } });

    const { findByTestId, getByText } = renderWithProviders(<DuplicatePopups />, {
      preloadedState,
    });

    // Wait for the name modal to become visible
    expect(await findByTestId(`${dataTestid}-name`)).toBeInTheDocument();

    await userEvent.click(getByText('Submit'));

    await waitFor(() => expect(getByText(/That Applet name already exists/)).toBeInTheDocument());
  });

  test('should duplicate and open success modal', async () => {
    mockGetRequestResponses({
      [`/applets/${mockedAppletId}`]: { data: { result: mockedAppletData } },
    });

    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: mockedAppletData } });
    jest
      .spyOn(encryptionFunctions, 'getEncryptionToServer')
      .mockReturnValue(Promise.resolve(mockedEncryption));
    vi.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPrivateKey: () => [],
      }),
    );

    const {
      findByTestId,
      findByLabelText,
      getByLabelText,
      getByText,
      getByTestId,
      store,
      queryByText,
    } = renderWithProviders(<DuplicatePopups />, {
      preloadedState,
    });

    // Wait for the name modal to become visible
    expect(await findByTestId(`${dataTestid}-name`)).toBeInTheDocument();

    // Report server checkbox SHOULD NOT be visible, as the applet does not contain such a config
    expect(queryByText('Include report server configuration')).toBeNull();

    // Submit the name form
    await userEvent.click(getByText('Submit'));

    // Wait for the password popup to show
    expect(await findByLabelText('Password')).toBeInTheDocument();

    // Fill out and submit the password popup
    await userEvent.type(getByLabelText('Password'), mockedPassword);
    await userEvent.type(getByLabelText('Repeat the password'), mockedPassword);
    await userEvent.click(getByTestId(`${dataTestid}-password-popup-submit-button`));

    // Wait for a success banner to show up
    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    // Make sure the duplicate API call excluded the report server config
    expect(mockAxios.post).toHaveBeenCalledWith(
      `/applets/${mockedAppletData.id}/duplicate`,
      expect.objectContaining({ includeReportServer: false }),
      abortSignal,
    );

    // Make sure the success banner is for the applet duplication
    expect(
      store
        .getState()
        .banners.data.banners.find(
          (payload) =>
            !!payload.bannerProps?.children?.toString().includes(mockedAppletData.displayName),
        ),
    ).toBeDefined();
  });

  test('should duplicate WITHOUT report server configuration when indicated', async () => {
    const mockedAppletDataWithReportServer: SingleApplet = {
      ...mockedAppletData,
      reportServerIp: 'http://localhost:8080',
      reportPublicKey: 'sample-public-key',
      reportEmailBody: 'sample-email-body',
      reportIncludeCaseId: true,
      reportIncludeUserId: true,
      reportRecipients: ['reportrecipient@example.com'],
    };

    jest
      .spyOn(applet, 'useAppletData')
      .mockReturnValue({ result: mockedAppletDataWithReportServer });

    mockGetRequestResponses({
      [`/applets/${mockedAppletId}`]: { data: { result: mockedAppletDataWithReportServer } },
    });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: mockedAppletData } });

    jest
      .spyOn(encryptionFunctions, 'getEncryptionToServer')
      .mockReturnValue(Promise.resolve(mockedEncryption));
    vi.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPrivateKey: () => [],
      }),
    );

    const {
      findByTestId,
      getByLabelText,
      findByLabelText,
      getByText,
      getByTestId,
      store,
      findByText,
    } = renderWithProviders(<DuplicatePopups />, {
      preloadedState,
    });

    // Wait for the name modal to become visible
    expect(await findByTestId(`${dataTestid}-name`)).toBeInTheDocument();

    // The report server checkbox SHOULD be visible
    expect(await findByText('Include report server configuration')).toBeInTheDocument();

    // Submit the name form WITHOUT checking the report server checkbox
    await userEvent.click(getByText('Submit'));

    // Wait for the password popup to show
    expect(await findByLabelText('Password')).toBeInTheDocument();

    // Fill out and submit the password popup
    await userEvent.type(getByLabelText('Password'), mockedPassword);
    await userEvent.type(getByLabelText('Repeat the password'), mockedPassword);
    await userEvent.click(getByTestId(`${dataTestid}-password-popup-submit-button`));

    // Wait for a success banner to show up
    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    // Make sure the duplicate API call excluded the report server config
    expect(mockAxios.post).toHaveBeenCalledWith(
      `/applets/${mockedAppletData.id}/duplicate`,
      expect.objectContaining({ includeReportServer: false }),
      abortSignal,
    );

    // Make sure the success banner is for the applet duplication
    expect(
      store
        .getState()
        .banners.data.banners.find(
          (payload) =>
            !!payload.bannerProps?.children?.toString().includes(mockedAppletData.displayName),
        ),
    ).toBeDefined();
  });

  test('should duplicate WITH report server configuration when indicated', async () => {
    const mockedAppletDataWithReportServer: SingleApplet = {
      ...mockedAppletData,
      reportServerIp: 'http://localhost:8080',
      reportPublicKey: 'sample-public-key',
      reportEmailBody: 'sample-email-body',
      reportIncludeCaseId: true,
      reportIncludeUserId: true,
      reportRecipients: ['reportrecipient@example.com'],
    };

    jest
      .spyOn(applet, 'useAppletData')
      .mockReturnValue({ result: mockedAppletDataWithReportServer });

    mockGetRequestResponses({
      [`/applets/${mockedAppletId}`]: { data: { result: mockedAppletDataWithReportServer } },
    });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: { name: 'name' } } });
    mockAxios.post.mockResolvedValueOnce({ data: { result: mockedAppletData } });
    jest
      .spyOn(global, 'fetch')
      .mockImplementation(
        jest.fn(() =>
          Promise.resolve({ json: () => Promise.resolve({ message: 'ok' }) }),
        ) as jest.Mock,
      );

    jest
      .spyOn(encryptionFunctions, 'getEncryptionToServer')
      .mockReturnValue(Promise.resolve(mockedEncryption));
    vi.spyOn(encryptionFunctions, 'getAppletEncryptionInfo').mockReturnValue(
      Promise.resolve({
        getPrivateKey: () => [],
      }),
    );
    jest
      .spyOn(encryptionFunctions, 'publicEncrypt')
      .mockReturnValue(Promise.resolve(btoa('Encrypted password')));

    const {
      getByTestId,
      findByTestId,
      getByLabelText,
      findByLabelText,
      getByText,
      store,
      findByText,
    } = renderWithProviders(<DuplicatePopups />, {
      preloadedState,
    });

    // Wait for the name modal to become visible
    expect(await findByTestId(`${dataTestid}-name`)).toBeInTheDocument();

    // The report server checkbox SHOULD be visible
    expect(await findByText('Include report server configuration')).toBeInTheDocument();

    // Toggle the checkbox
    await userEvent.click(getByTestId(`${dataTestid}-include-report-server`));

    // Submit the name form
    await userEvent.click(getByText('Submit'));

    // Wait for the password popup to show
    expect(await findByLabelText('Password')).toBeInTheDocument();

    // Fill out and submit the password popup
    await userEvent.type(getByLabelText('Password'), mockedPassword);
    await userEvent.type(getByLabelText('Repeat the password'), mockedPassword);
    await userEvent.click(getByTestId(`${dataTestid}-password-popup-submit-button`));

    // Wait for a success banner to show up
    await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));

    // Make sure the duplicate API call included the report server config
    expect(mockAxios.post).toHaveBeenCalledWith(
      `/applets/${mockedAppletData.id}/duplicate`,
      expect.objectContaining({ includeReportServer: true }),
      abortSignal,
    );

    // Make sure the success banner is for the applet duplication
    expect(
      store
        .getState()
        .banners.data.banners.find(
          (payload) =>
            !!payload.bannerProps?.children?.toString().includes(mockedAppletData.displayName),
        ),
    ).toBeDefined();
  });
});
