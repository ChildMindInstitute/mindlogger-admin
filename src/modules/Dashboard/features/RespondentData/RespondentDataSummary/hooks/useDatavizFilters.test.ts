import { renderHook } from '@testing-library/react';
import * as reactHookForm from 'react-hook-form';

import { Version } from 'api';

import { useDatavizFilters } from './useDatavizFilters';

describe('useDatavizFilters', () => {
  const mockFormReturnValues = [new Date('2023-01-10'), new Date('2023-01-15'), '00:00', '23:59'];

  beforeEach(() => {
    jest.spyOn(reactHookForm, 'useWatch').mockReturnValue(mockFormReturnValues);
  });

  test('should calculate minDate, maxDate correctly and return empty versions', () => {
    const versions: Version[] = [];

    const { result } = renderHook(() => useDatavizFilters(versions));

    expect(result.current.minDate).toEqual(new Date('2023-01-10T00:00:00'));
    expect(result.current.maxDate).toEqual(new Date('2023-01-15T23:59:00'));
    expect(result.current.filteredVersions).toEqual([]);
  });

  test('should calculate minDate, maxDate correctly and return all versions', () => {
    const versions = [
      {
        version: '1.0.0',
        createdAt: '2023-01-10T10:00:00',
      },
      { version: '1.0.1', createdAt: '2023-01-11T16:40:00' },
      { version: '1.1.0', createdAt: '2023-01-15T20:15:00' },
    ];

    const { result } = renderHook(() => useDatavizFilters(versions));

    expect(result.current.minDate).toEqual(new Date('2023-01-10T00:00:00'));
    expect(result.current.maxDate).toEqual(new Date('2023-01-15T23:59:00'));
    expect(result.current.filteredVersions).toEqual([
      {
        version: '1.0.0',
        createdAt: '2023-01-10T10:00:00',
      },
      { version: '1.0.1', createdAt: '2023-01-11T16:40:00' },
      { version: '1.1.0', createdAt: '2023-01-15T20:15:00' },
    ]);
  });

  test('should calculate minDate, maxDate correctly and return filtered versions', () => {
    const versions = [
      {
        version: '1.0.0',
        createdAt: '2023-01-09T10:00:00',
      },
      { version: '1.0.1', createdAt: '2023-01-11T16:40:00' },
      { version: '1.1.0', createdAt: '2023-01-17T20:15:00' },
    ];

    const { result } = renderHook(() => useDatavizFilters(versions));

    expect(result.current.minDate).toEqual(new Date('2023-01-10T00:00:00'));
    expect(result.current.maxDate).toEqual(new Date('2023-01-15T23:59:00'));
    expect(result.current.filteredVersions).toEqual([
      { version: '1.0.1', createdAt: '2023-01-11T16:40:00' },
    ]);
  });
});
