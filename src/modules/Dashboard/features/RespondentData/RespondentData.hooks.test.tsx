import { renderHook } from '@testing-library/react';

import {
  mockedApplet,
  mockedAppletId,
  mockedIdentifiers,
  mockedPrivateKey,
  mockedRespondentId,
} from 'shared/mock';
import { Identifier as IdentifierResponse, Version } from 'api';
import { applet } from 'shared/state';

import { Identifier } from './RespondentData.types';
import {
  useRespondentDataTabs,
  useDatavizFilters,
  useDecryptedIdentifiers,
} from './RespondentData.hooks';

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

jest.mock('shared/hooks/useEncryptionStorage', () => ({
  useEncryptionStorage: () => ({
    getAppletPrivateKey: () => mockedPrivateKey,
  }),
}));

const mockWatch = jest.fn();

const mockSummaryFiltersForm = {
  startDate: new Date('2023-01-10'),
  endDate: new Date('2023-01-15'),
  moreFiltersVisible: false,
  startTime: '00:00',
  endTime: '23:59',
};

describe('Respondent Data hooks', () => {
  describe('useRespondentDataTabs', () => {
    test('returns an array of tab objects', () => {
      mockedUseParams.mockReturnValue({
        appletId: mockedAppletId,
        respondentId: mockedRespondentId,
      });
      const { result } = renderHook(useRespondentDataTabs);

      expect(result.current).toEqual([
        {
          labelKey: 'summary',
          id: 'respondent-data-summary',
          icon: expect.any(Object),
          activeIcon: expect.any(Object),
          path: `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`,
          'data-testid': 'respondents-summary-tab-summary',
        },
        {
          labelKey: 'responses',
          id: 'respondent-data-responses',
          icon: expect.any(Object),
          activeIcon: expect.any(Object),
          path: `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses`,
          'data-testid': 'respondents-summary-tab-review',
        },
      ]);
    });
  });

  describe('useDatavizFilters', () => {
    test('should calculate minDate, maxDate correctly and return empty versions', () => {
      const versions: Version[] = [];

      mockWatch.mockReturnValue(mockSummaryFiltersForm);
      const { result } = renderHook(() => useDatavizFilters(mockWatch, versions));

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

      mockWatch.mockReturnValue(mockSummaryFiltersForm);
      const { result } = renderHook(() => useDatavizFilters(mockWatch, versions));

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

      mockWatch.mockReturnValue(mockSummaryFiltersForm);
      const { result } = renderHook(() => useDatavizFilters(mockWatch, versions));

      expect(result.current.minDate).toEqual(new Date('2023-01-10T00:00:00'));
      expect(result.current.maxDate).toEqual(new Date('2023-01-15T23:59:00'));
      expect(result.current.filteredVersions).toEqual([
        { version: '1.0.1', createdAt: '2023-01-11T16:40:00' },
      ]);
    });
  });

  describe('useDecryptedIdentifiers', () => {
    test('should return null when useAppletData is null', async () => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue(null);
      mockedUseParams.mockReturnValue({ appletId: mockedAppletId });
      // jest.spyOn(routerDom, 'useParams').mockReturnValue({ appletId: 'new-applet' });

      const { result } = renderHook(useDecryptedIdentifiers);

      expect(await result.current).toEqual(null);
    });

    test('should return an array of identifiers for decrypted data (userPublicKey: null)', async () => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
      mockedUseParams.mockReturnValue({ appletId: mockedAppletId });

      const identifiers = [
        {
          identifier: 'Identifier_1',
          userPublicKey: null,
        },
        {
          identifier: 'Identifier_2',
          userPublicKey: null,
        },
      ];

      const { result } = renderHook(useDecryptedIdentifiers);
      const getDecryptedIdentifiers = result.current as (
        identifiers: IdentifierResponse[],
      ) => Promise<Identifier[]>;

      const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers);

      expect(decryptedIdentifiers).toEqual([
        {
          decryptedValue: 'Identifier_1',
          encryptedValue: 'Identifier_1',
        },
        {
          decryptedValue: 'Identifier_2',
          encryptedValue: 'Identifier_2',
        },
      ]);
    });

    test('should return an array of identifiers for encrypted data', async () => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue({ result: mockedApplet });
      mockedUseParams.mockReturnValue({ appletId: mockedAppletId });

      const { result } = renderHook(useDecryptedIdentifiers);
      const getDecryptedIdentifiers = result.current as (
        identifiers: IdentifierResponse[],
      ) => Promise<Identifier[]>;

      const decryptedIdentifiers = await getDecryptedIdentifiers(
        mockedIdentifiers as IdentifierResponse[],
      );

      expect(decryptedIdentifiers).toEqual([
        {
          decryptedValue: 'Test User',
          encryptedValue: '09a0bbf7994d5cf408292d7fb35dce18:e8051724b3f422950c1b0eb9c7013c72',
        },
        {
          decryptedValue: 'Jane Doe',
          encryptedValue: 'd0aa7af502fd96704585bee074786497:7f619511aaefa1bad1f5af6b3ef22d9b',
        },
      ]);
    });
  });
});
