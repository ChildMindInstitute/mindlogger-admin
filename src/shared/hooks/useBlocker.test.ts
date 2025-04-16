import { renderHook, act } from '@testing-library/react';
import { Action } from 'history';

import history from 'routes/history';

import { useBlocker } from './useBlocker';

const mockBlocker = vi.fn();
const spyHistoryBlock = vi.spyOn(history, 'block');

describe('useBlocker', () => {
  test('should call history.block when "when" is true', () => {
    renderHook(() => useBlocker(mockBlocker, true));
    expect(spyHistoryBlock).toHaveBeenCalled();
  });

  test('should not call history.block when "when" is false', () => {
    renderHook(() => useBlocker(mockBlocker, false));
    expect(spyHistoryBlock).not.toHaveBeenCalled();
  });

  test('should call the blocker function with the correct parameters', () => {
    renderHook(() => useBlocker(mockBlocker, true));
    const blockingFunction = spyHistoryBlock.mock.calls[0][0];
    const mockTransition = {
      retry: vi.fn(),
      action: Action.Pop,
      location: {
        state: 'some-state',
        key: 'some-key',
        pathname: 'some-pathname',
        search: 'some-search',
        hash: 'some-hash',
      },
    };

    blockingFunction(mockTransition);
    expect(mockBlocker).toHaveBeenCalledWith({
      ...mockTransition,
      retry: expect.any(Function),
    });
  });

  test('should unblock when the component unmounts', () => {
    const { unmount } = renderHook(() => useBlocker(mockBlocker, true));
    expect(spyHistoryBlock).toHaveBeenCalled();
    act(() => {
      unmount();
    });
    expect(spyHistoryBlock).toHaveBeenCalled();
  });
});
