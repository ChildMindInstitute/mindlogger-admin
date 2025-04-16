import { PreloadedState } from '@reduxjs/toolkit';

import { auth } from 'redux/modules';
import { authStorage } from 'shared/utils';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { RootState } from 'redux/store';

import { useSessionBanners } from './useSessionBanners';

const emptyState: PreloadedState<RootState> = {
  banners: {
    data: {
      banners: [],
    },
  },
};

const populatedState: PreloadedState<RootState> = {
  banners: {
    data: {
      banners: [{ key: 'SaveSuccessBanner' }],
    },
  },
};

const spyAccessToken = vi.spyOn(authStorage, 'getAccessToken');
const spyUseStatus = vi.spyOn(auth, 'useStatus');

describe('useSessionBanners', () => {
  test('should remove all banners when the session becomes invalid', () => {
    spyAccessToken.mockReturnValue('access-token');
    spyUseStatus.mockReturnValue('success');

    const { rerender, store } = renderHookWithProviders(useSessionBanners, {
      preloadedState: populatedState,
    });

    spyAccessToken.mockReturnValue(null);
    spyUseStatus.mockReturnValue('idle');

    rerender();

    expect(store.getState().banners).toEqual(emptyState.banners);
  });
});
