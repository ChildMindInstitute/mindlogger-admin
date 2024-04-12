import {
  DEFAULT_END_DATE,
  DEFAULT_END_TIME,
  DEFAULT_START_DATE,
  DEFAULT_START_TIME,
} from 'modules/Dashboard/features/RespondentData/RespondentData.const';

import { setDefaultFormValues } from './useDatavizSummaryRequests.utils';

describe('useDatavizSummaryRequests utils', () => {
  describe('setDefaultFormValues', () => {
    test('should set default values for form fields', () => {
      const setValueMock = jest.fn();
      setDefaultFormValues(setValueMock);

      expect(setValueMock).toHaveBeenCalledTimes(6);
      expect(setValueMock).toHaveBeenCalledWith('startDate', DEFAULT_START_DATE);
      expect(setValueMock).toHaveBeenCalledWith('endDate', DEFAULT_END_DATE);
      expect(setValueMock).toHaveBeenCalledWith('startTime', DEFAULT_START_TIME);
      expect(setValueMock).toHaveBeenCalledWith('endTime', DEFAULT_END_TIME);
      expect(setValueMock).toHaveBeenCalledWith('filterByIdentifier', false);
      expect(setValueMock).toHaveBeenCalledWith('identifier', []);
    });
  });
});
