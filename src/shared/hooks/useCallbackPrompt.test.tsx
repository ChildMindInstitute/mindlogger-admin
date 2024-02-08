import { ReactNode } from 'react';

import { renderHook, act } from '@testing-library/react';
import { Update } from 'history';
import { unstable_HistoryRouter as Router } from 'react-router-dom';

import history from 'routes/history';

import { usePromptSetup } from './useCallbackPrompt';

const wrapper = ({ children }: { children: ReactNode }) => (
  // @ts-expect-error history-router now unstable and it's a known error https://github.com/remix-run/react-router/issues/9630
  <Router history={history}>{children}</Router>
);

describe('usePromptSetup', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => usePromptSetup(), { wrapper });
    expect(result.current.location).toBeDefined();
    expect(result.current.promptVisible).toBe(false);
    expect(result.current.lastLocation).toBe(null);
    expect(result.current.confirmedNavigation).toBe(false);
  });

  test('should update state values', () => {
    const { result } = renderHook(() => usePromptSetup(), { wrapper });

    act(() => {
      result.current.setPromptVisible(true);
      result.current.setLastLocation({ location: { pathname: '/some-path' } } as Update);
      result.current.setConfirmedNavigation(true);
    });

    expect(result.current.promptVisible).toBe(true);
    expect(result.current.lastLocation?.location?.pathname).toBe('/some-path');
    expect(result.current.confirmedNavigation).toBe(true);
  });
});
