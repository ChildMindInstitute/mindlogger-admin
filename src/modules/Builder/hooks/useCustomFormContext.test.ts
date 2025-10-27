import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useCustomFormContext } from './useCustomFormContext';

const mockedSetValue = vi.fn();

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    setValue: mockedSetValue,
  }),
}));

describe('useCustomFormContext', () => {
  test.each`
    options                  | description
    ${undefined}             | ${'Original setValue should be called with { shouldDirty: true } if options are not provided'}
    ${{}}                    | ${'Original setValue should be called with { shouldDirty: true } if options are empty object'}
    ${{ shouldTouch: true }} | ${'Original setValue should be called with { shouldDirty: true, ...providedOptions } if options contain parameters differ from "shouldDirty"'}
    ${{ shouldDirty: true }} | ${'Original setValue should be called with { shouldDirty: false } if { shouldDirty: false} is provided with options'}
  `('$description', ({ options }) => {
    const { result } = renderHook(useCustomFormContext);

    result.current.setValue('name', 'value', options);

    expect(mockedSetValue).toBeCalledWith('name', 'value', { ...options, shouldDirty: true });
  });
});
