import { act } from '@testing-library/react';

import { RootState } from 'redux/store';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useSessionElsewhereGuard } from './useSessionElsewhereGuard';

const sessionElsewhereState = {
  auth: { hasSessionElsewhere: true },
} as Pick<RootState, 'auth'>;

// What the tab is showing before anything is pressed, which the user can dismiss.
const withBannerShowing = {
  ...sessionElsewhereState,
  banners: { data: { banners: [{ key: 'SessionElsewhereBanner' }] } },
} as Pick<RootState, 'auth' | 'banners'>;

type Store = ReturnType<typeof renderHookWithProviders>['store'];

const bannersIn = (store: Store) => store.getState().banners.data.banners;

describe('useSessionElsewhereGuard', () => {
  it('lets the action through while this browser holds no other session', () => {
    const { result } = renderHookWithProviders(useSessionElsewhereGuard);

    let wasRefused = true;
    act(() => {
      wasRefused = result.current.refuse();
    });

    expect(wasRefused).toBe(false);
    expect(result.current.isBlocked).toBe(false);
  });

  it('refuses the action while another tab holds the session', () => {
    const { result } = renderHookWithProviders(useSessionElsewhereGuard, {
      preloadedState: sessionElsewhereState,
    });

    let wasRefused = false;
    act(() => {
      wasRefused = result.current.refuse();
    });

    expect(wasRefused).toBe(true);
    expect(result.current.isBlocked).toBe(true);
  });

  // Nothing on the page works from here on: the way forward is a reload, not another press.
  it('stays blocked once it has refused', () => {
    const { result } = renderHookWithProviders(useSessionElsewhereGuard, {
      preloadedState: sessionElsewhereState,
    });

    act(() => {
      result.current.refuse();
    });
    act(() => {
      result.current.refuse();
    });

    expect(result.current.isBlocked).toBe(true);
  });

  // Nothing is refused until something is actually pressed, so the page looks normal on arrival.
  it('starts unblocked even when another tab holds the session', () => {
    const { result } = renderHookWithProviders(useSessionElsewhereGuard, {
      preloadedState: sessionElsewhereState,
    });

    expect(result.current.isBlocked).toBe(false);
  });

  // A dismissed message plus a control that quietly stops working reads as the page being broken.
  it('brings the banner back when it has been dismissed', () => {
    const { result, store } = renderHookWithProviders(useSessionElsewhereGuard, {
      preloadedState: sessionElsewhereState,
    });

    act(() => {
      result.current.refuse();
    });

    expect(bannersIn(store)).toHaveLength(1);
    expect(bannersIn(store)[0].key).toBe('SessionElsewhereBanner');
  });

  it('does not stack a second banner on top of the one already showing', () => {
    const { result, store } = renderHookWithProviders(useSessionElsewhereGuard, {
      preloadedState: withBannerShowing,
    });

    act(() => {
      result.current.refuse();
    });
    act(() => {
      result.current.refuse();
    });

    expect(bannersIn(store)).toHaveLength(1);
  });

  it('raises nothing when the action was allowed through', () => {
    const { result, store } = renderHookWithProviders(useSessionElsewhereGuard);

    act(() => {
      result.current.refuse();
    });

    expect(bannersIn(store)).toHaveLength(0);
  });
});
