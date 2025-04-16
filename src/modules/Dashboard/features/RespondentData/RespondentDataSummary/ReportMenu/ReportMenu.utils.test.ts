import { DEFAULT_END_TIME, DEFAULT_START_TIME } from 'shared/consts';

import { setDefaultFormValues } from './ReportMenu.utils';

describe('ReportMenu utils', () => {
  describe('setDefaultFormValues', () => {
    test('should set default values for form fields', () => {
      const setValueMock = vi.fn();
      setDefaultFormValues(setValueMock);

      expect(setValueMock).toHaveBeenCalledTimes(5);
      expect(setValueMock).toHaveBeenCalledWith('startTime', DEFAULT_START_TIME);
      expect(setValueMock).toHaveBeenCalledWith('endTime', DEFAULT_END_TIME);
      expect(setValueMock).toHaveBeenCalledWith('filterByIdentifier', false);
      expect(setValueMock).toHaveBeenCalledWith('identifier', []);
      expect(setValueMock).toHaveBeenCalledWith('versions', []);
    });
  });
});
