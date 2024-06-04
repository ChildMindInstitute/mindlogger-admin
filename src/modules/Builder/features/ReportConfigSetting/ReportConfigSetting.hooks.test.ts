// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { act, renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { SingleApplet } from 'shared/state';
import { authStorage } from 'shared/utils/authStorage';

import { verifyReportServer, setPasswordReportServer } from './ReportConfigSetting.utils';
import { useCheckReportServer, useDefaultValues } from './ReportConfigSetting.hooks';
import {
  OK_MESSAGE,
  SUCCESS_MESSAGE,
  defaultValues as initialValues,
} from './ReportConfigSetting.const';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('shared/utils/authStorage', () => ({
  authStorage: {
    getAccessToken: jest.fn(),
  },
}));

jest.mock('./ReportConfigSetting.utils', () => ({
  verifyReportServer: jest.fn(),
  setPasswordReportServer: jest.fn(),
}));

describe('useCheckReportServer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('onVerify returns true when server responds with OK_MESSAGE', async () => {
    const mockUrl = 'http://example.com';
    const mockPublicKey = 'mockPublicKey';
    const mockToken = 'mockToken';
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (verifyReportServer as jest.Mock).mockResolvedValue({
      json: async () => ({ message: OK_MESSAGE }),
    });
    (useParams as jest.Mock).mockReturnValue({ appletId: 'testAppletId', ownerId: 'testOwnerId' });

    const { result } = renderHook(() =>
      useCheckReportServer({ url: mockUrl, publicKey: mockPublicKey }),
    );

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
    const mockUrl = 'http://example.com';
    const mockPublicKey = 'mockPublicKey';
    const mockToken = 'mockToken';
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (verifyReportServer as jest.Mock).mockResolvedValue({
      json: async () => ({ message: 'OTHER_MESSAGE' }),
    });
    (useParams as jest.Mock).mockReturnValue({ appletId: 'testAppletId', ownerId: 'testOwnerId' });

    const { result } = renderHook(() =>
      useCheckReportServer({ url: mockUrl, publicKey: mockPublicKey }),
    );

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
    const mockUrl = 'http://example.com';
    const mockPassword = 'mockPassword';
    const mockToken = 'mockToken';
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (setPasswordReportServer as jest.Mock).mockResolvedValue({
      json: async () => ({ message: SUCCESS_MESSAGE }),
    });
    (useParams as jest.Mock).mockReturnValue({ appletId: 'testAppletId', ownerId: 'testOwnerId' });

    const { result } = renderHook(() =>
      useCheckReportServer({ url: mockUrl, publicKey: 'mockPublicKey' }),
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
    const mockUrl = 'http://example.com';
    const mockPassword = 'mockPassword';
    const mockToken = 'mockToken';
    (authStorage.getAccessToken as jest.Mock).mockReturnValue(mockToken);
    (setPasswordReportServer as jest.Mock).mockResolvedValue({
      json: async () => ({ message: 'OTHER_MESSAGE' }),
    });
    (useParams as jest.Mock).mockReturnValue({ appletId: 'testAppletId', ownerId: 'testOwnerId' });

    const { result } = renderHook(() =>
      useCheckReportServer({ url: mockUrl, publicKey: 'mockPublicKey' }),
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
    jest.clearAllMocks();
  });

  test('returns initialValues when no appletData provided', () => {
    (useParams as jest.Mock).mockReturnValue({});

    const { result } = renderHook(() => useDefaultValues());

    expect(result.current).toEqual(initialValues);
  });

  test('returns correct values when appletData provided with activityId', () => {
    const mockAppletData: SingleApplet = {
      reportServerIp: '192.168.0.1',
      reportPublicKey: 'publicKey',
      reportRecipients: ['recipient@example.com'],
      reportIncludeUserId: true,
      reportEmailBody: 'Email Body',
      activities: [{ id: 'activity1', key: 'key1', reportIncludedItemName: 'Item Name' }],
      activityFlows: [],
    };
    (useParams as jest.Mock).mockReturnValue({ activityId: 'activity1' });

    const { result } = renderHook(() => useDefaultValues(mockAppletData));

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
    const mockAppletData: SingleApplet = {
      reportServerIp: '192.168.0.1',
      reportPublicKey: 'publicKey',
      reportRecipients: ['recipient@example.com'],
      reportIncludeUserId: true,
      reportEmailBody: 'Email Body',
      activities: [],
      activityFlows: [
        {
          id: 'flow1',
          key: 'keyFlow1',
          reportIncludedActivityName: 'Activity Name',
          reportIncludedItemName: 'Item Name',
        },
      ],
    };
    (useParams as jest.Mock).mockReturnValue({ activityFlowId: 'flow1' });

    const { result } = renderHook(() => useDefaultValues(mockAppletData));

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
