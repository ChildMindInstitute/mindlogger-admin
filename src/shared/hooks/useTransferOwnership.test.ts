/* eslint-disable quotes */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { waitFor, screen } from '@testing-library/react';
import { PreloadedState } from '@reduxjs/toolkit';

import * as MixpanelFunc from 'shared/utils/mixpanel';
import { RootState } from 'redux/store';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { MixpanelEventType, MixpanelProps } from 'shared/utils/mixpanel';

import { useTransferOwnership } from './useTransferOwnership';

const emptyState: PreloadedState<RootState> = {
  banners: {
    data: {
      banners: [],
    },
  },
};
const email = 'test@email.com';
const populatedState: PreloadedState<RootState> = {
  banners: {
    data: {
      banners: [
        {
          key: 'TransferOwnershipSuccessBanner',
          bannerProps: { email },
        },
      ],
    },
  },
};
const appletId = 'appletId';

describe('useTransferOwnership', () => {
  test('should return initial values', () => {
    const { result } = renderHookWithProviders(() => useTransferOwnership(appletId));

    expect(result.current).toStrictEqual({
      isSubmitted: false,
      setIsSubmitted: expect.any(Function),
      handleSubmit: expect.any(Function),
      handleSendInvitation: expect.any(Function),
    });
  });

  test('should change isSubmitted to true if handleSubmit triggered', async () => {
    const { result } = renderHookWithProviders(() => useTransferOwnership(appletId));

    result.current?.handleSubmit?.();

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        isSubmitted: true,
        setIsSubmitted: expect.any(Function),
        handleSubmit: expect.any(Function),
        handleSendInvitation: expect.any(Function),
      }),
    );
  });

  test('should show success banner when transferring ownership succeeds', async () => {
    const mixpanelTrack = jest.spyOn(MixpanelFunc.Mixpanel, 'track');
    const { result, rerender, store } = renderHookWithProviders(
      () => useTransferOwnership(appletId),
      {
        preloadedState: emptyState,
      },
    );
    const mockedCallback = jest.fn();

    expect(store.getState().banners).toEqual(emptyState.banners);
    expect(screen.queryByTestId('testId')).toBeNull();

    result.current.handleSendInvitation(mockedCallback)(email);

    rerender();

    expect(store.getState().banners).toEqual(populatedState.banners);
    expect(mockedCallback).toBeCalled();
    expect(mixpanelTrack).toBeCalledWith({
      action: MixpanelEventType.InvitationSent,
      [MixpanelProps.AppletId]: 'appletId',
    });
  });
});
