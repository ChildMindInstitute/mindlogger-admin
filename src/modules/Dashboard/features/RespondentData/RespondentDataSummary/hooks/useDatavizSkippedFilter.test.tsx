import { renderHook } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import { SessionStorageKeys } from 'shared/utils';
import { mockedAppletId } from 'shared/mock';

import { useDatavizSkippedFilter } from './useDatavizSkippedFilter';

const mockedUseParams = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    useWatch: () => jest.fn(),
  }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('useDatavizSkippedFilter', () => {
  const sessionStorageKey = SessionStorageKeys.DatavizHideSkipped;
  beforeEach(() => {
    sessionStorage.clear();
    jest.resetAllMocks();
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
  });

  it('returns default value when sessionStorage is not available', () => {
    const { result } = renderHook(() => useDatavizSkippedFilter(), { wrapper: Wrapper });

    expect(result.current.hideSkipped).toBe(false);
  });

  it('retrieves value from sessionStorage if available', () => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify({ [mockedAppletId]: true }));
    const { result } = renderHook(() => useDatavizSkippedFilter(), { wrapper: Wrapper });

    expect(result.current.hideSkipped).toBe(true);
  });

  it('updates sessionStorage when value changes', () => {
    sessionStorage.setItem(sessionStorageKey, JSON.stringify({ [mockedAppletId]: false }));

    const { result, rerender } = renderHook(() => useDatavizSkippedFilter(), { wrapper: Wrapper });
    result.current.setSkipped(true);
    rerender();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(sessionStorage.getItem(sessionStorageKey)!)).toEqual({
      [mockedAppletId]: true,
    });
  });

  it('should handle multiple appletIds independently', () => {
    const { result, rerender } = renderHook(() => useDatavizSkippedFilter(), { wrapper: Wrapper });

    expect(result.current.hideSkipped).toBe(false);

    result.current.setSkipped(true);
    rerender();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(sessionStorage.getItem(SessionStorageKeys.DatavizHideSkipped)!)).toEqual({
      [mockedAppletId]: true,
    });
    expect(result.current.hideSkipped).toBe(true);

    // Switching to another applet
    mockedUseParams.mockReturnValue({ appletId: 'other-applet' });
    const { result: result2 } = renderHook(() => useDatavizSkippedFilter(), { wrapper: Wrapper });

    expect(result2.current.hideSkipped).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(JSON.parse(sessionStorage.getItem(SessionStorageKeys.DatavizHideSkipped)!)).toEqual({
      [mockedAppletId]: true,
      'other-applet': false,
    });
  });

  it('handles missing appletId', () => {
    mockedUseParams.mockReturnValue({ appletId: '' });

    const { result } = renderHook(() => useDatavizSkippedFilter(), { wrapper: Wrapper });

    expect(result.current.hideSkipped).toBe(false);
  });
});
