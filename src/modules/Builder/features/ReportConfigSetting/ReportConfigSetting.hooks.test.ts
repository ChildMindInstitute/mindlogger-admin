// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { act, renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { authStorage } from 'shared/utils/authStorage';

import { verifyReportServer, setPasswordReportServer } from './ReportConfigSetting.utils';
import { useCheckReportServer, useDefaultValues } from './ReportConfigSetting.hooks';
import {
  OK_MESSAGE,
  SUCCESS_MESSAGE,
  defaultValues as initialValues,
} from './ReportConfigSetting.const';

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => vi.fn(),
  };
});

vi.mock('shared/utils/authStorage', () => ({
  authStorage: {
    getAccessToken: vi.fn(),
  },
}));

vi.mock('./ReportConfigSetting.utils', () => ({
  verifyReportServer: vi.fn(),
  setPasswordReportServer: vi.fn(),
}));

const mockUrl = 'http://example.com';
const mockPublicKey = 'mockPublicKey';
const mockToken = 'mockToken';
const mockPassword = 'mockPassword';

const renderReportServerHook = (message: string) => {
  (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
  (verifyReportServer as jest.Mock).mockResolvedValue({
    json: async () => ({ message }),
  });

  return renderHook(() =>
    useCheckReportServer({
      url: mockUrl,
      publicKey: mockPublicKey,
      appletId: 'testAppletId',
      ownerId: 'testOwnerId',
    }),
  );
};

const renderDefaultValuesHook = (appletData = {}, params) => {
  (useParams as jest.Mock).mockReturnValue(params);

  return renderHook(() =>
    useDefaultValues({
      reportServerIp: '192.168.0.1',
      reportPublicKey: 'publicKey',
      reportRecipients: ['recipient@example.com'],
      reportIncludeUserId: true,
      reportEmailBody: 'Email Body',
      activities: [{ id: 'activity1', key: 'key1', reportIncludedItemName: 'Item Name' }],
      activityFlows: [],
      ...appletData,
    }),
  );
};

describe('useCheckReportServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('onVerify returns true when server responds with OK_MESSAGE', async () => {
    const { result } = renderReportServerHook(OK_MESSAGE);

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.onVerify();
    });

    expect(verifyResult).toBe(true);
    expect(authStorage.getAccessToken).toHaveBeenCalled();
    expect(verifyReportServer).toHaveBeenCalledWith({
      url: mockUrl,
      publicKey: mockPublicKey,
      token: mockToken,
    });
  });

  test('onVerify returns false when server does not respond with OK_MESSAGE', async () => {
    const { result } = renderReportServerHook('OTHER_MESSAGE');

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.onVerify();
    });

    expect(verifyResult).toBe(false);
    expect(authStorage.getAccessToken).toHaveBeenCalled();
    expect(verifyReportServer).toHaveBeenCalledWith({
      url: mockUrl,
      publicKey: mockPublicKey,
      token: mockToken,
    });
  });

  test('onSetPassword returns true when server responds with SUCCESS_MESSAGE', async () => {
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (setPasswordReportServer as jest.Mock).mockResolvedValue({
      json: async () => ({ message: SUCCESS_MESSAGE }),
    });

    const { result } = renderHook(() =>
      useCheckReportServer({
        url: mockUrl,
        publicKey: 'mockPublicKey',
        appletId: 'testAppletId',
        ownerId: 'testOwnerId',
      }),
    );

    let setPasswordResult;
    await act(async () => {
      setPasswordResult = await result.current.onSetPassword(mockPassword);
    });

    expect(setPasswordResult).toBe(true);
    expect(authStorage.getAccessToken).toHaveBeenCalled();
    expect(setPasswordReportServer).toHaveBeenCalledWith({
      url: mockUrl,
      appletId: 'testAppletId',
      ownerId: 'testOwnerId',
      token: mockToken,
      password: mockPassword,
    });
  });

  test('onSetPassword returns false when server does not respond with SUCCESS_MESSAGE', async () => {
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (setPasswordReportServer as jest.Mock).mockResolvedValue({
      json: async () => ({ message: 'OTHER_MESSAGE' }),
    });

    const { result } = renderHook(() =>
      useCheckReportServer({
        url: mockUrl,
        publicKey: 'mockPublicKey',
        appletId: 'testAppletId',
        ownerId: 'testOwnerId',
      }),
    );

    let setPasswordResult;
    await act(async () => {
      setPasswordResult = await result.current.onSetPassword(mockPassword);
    });

    expect(setPasswordResult).toBe(false);
    expect(authStorage.getAccessToken).toHaveBeenCalled();
    expect(setPasswordReportServer).toHaveBeenCalledWith({
      url: mockUrl,
      appletId: 'testAppletId',
      ownerId: 'testOwnerId',
      token: mockToken,
      password: mockPassword,
    });
  });
});

describe('useDefaultValues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns initialValues when no appletData provided', () => {
    (useParams as jest.Mock).mockReturnValue({});

    const { result } = renderHook(() => useDefaultValues());

    expect(result.current).toEqual(initialValues);
  });

  test('returns correct values when appletData provided with activityId', () => {
    const { result } = renderDefaultValuesHook({}, { activityId: 'activity1' });

    expect(result.current).toEqual({
      ...initialValues,
      reportServerIp: '192.168.0.1',
      reportPublicKey: 'publicKey',
      reportRecipients: ['recipient@example.com'],
      reportIncludeUserId: true,
      reportIncludedItemName: 'Item Name',
      reportIncludedActivityName: '',
      reportEmailBody: 'Email Body',
      itemValue: true,
    });
  });

  test('returns correct values when appletData provided with activityFlowId', () => {
    const { result } = renderDefaultValuesHook(
      {
        activities: [],
        activityFlows: [
          {
            id: 'flow1',
            key: 'keyFlow1',
            reportIncludedActivityName: 'Activity Name',
            reportIncludedItemName: 'Item Name',
          },
        ],
      },
      { activityFlowId: 'flow1' },
    );
    expect(result.current).toEqual({
      ...initialValues,
      reportServerIp: '192.168.0.1',
      reportPublicKey: 'publicKey',
      reportRecipients: ['recipient@example.com'],
      reportIncludeUserId: true,
      reportIncludedItemName: 'Item Name',
      reportIncludedActivityName: 'Activity Name',
      reportEmailBody: 'Email Body',
      itemValue: true,
    });
  });
});
