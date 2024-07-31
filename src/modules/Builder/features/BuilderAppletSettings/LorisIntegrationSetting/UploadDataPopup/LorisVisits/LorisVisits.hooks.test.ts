import { renderHook, waitFor } from '@testing-library/react';

import { getLorisUsersVisitsApi, getLorisVisitsApi } from 'modules/Builder/api';

import { Steps } from '../UploadDataPopup.types';
import { formatData } from './LorisVisits.utils';
import { useFetchVisitsData } from './LorisVisits.hooks';

jest.mock('modules/Builder/api');
jest.mock('./LorisVisits.utils');

describe('useFetchVisitsData', () => {
  const mockSetIsLoading = jest.fn();
  const mockSetVisitsList = jest.fn();
  const mockSetVisitsData = jest.fn();
  const mockReset = jest.fn();
  const mockSetStep = jest.fn();
  const mockAppletId = 'test-applet-id';

  const defaultProps = {
    appletId: mockAppletId,
    onSetIsLoading: mockSetIsLoading,
    setVisitsList: mockSetVisitsList,
    setVisitsData: mockSetVisitsData,
    reset: mockReset,
    setStep: mockSetStep,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not fetch data when appletId is not provided', async () => {
    const { result } = renderHook(() => useFetchVisitsData({ ...defaultProps, appletId: '' }));

    expect(result.current.isLoadingCompleted).toBe(false);
    expect(mockSetIsLoading).not.toHaveBeenCalled();
  });

  test('should fetch data and set visits and visits data on success', async () => {
    const visitsData = { data: { visits: ['visit1', 'visit2'] } };
    const usersVisitsData = { data: { result: 'usersVisitsInfo' } };
    (getLorisVisitsApi as jest.Mock).mockResolvedValue(visitsData);
    (getLorisUsersVisitsApi as jest.Mock).mockResolvedValue(usersVisitsData);
    (formatData as jest.Mock).mockReturnValue('formattedData');

    const { result } = renderHook(() => useFetchVisitsData(defaultProps));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(result.current.isLoadingCompleted).toBe(false);

    await waitFor(() => expect(result.current.isLoadingCompleted).toBe(true));

    expect(mockSetVisitsList).toHaveBeenCalledWith(visitsData.data.visits);
    expect(formatData).toHaveBeenCalledWith(usersVisitsData.data.result);
    expect(mockSetVisitsData).toHaveBeenCalledWith('formattedData');
    expect(mockReset).toHaveBeenCalledWith({ visitsForm: 'formattedData' });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  test('should handle errors during data fetching', async () => {
    const error = new Error('fetch error');
    (getLorisVisitsApi as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useFetchVisitsData(defaultProps));

    await waitFor(() => expect(result.current.isLoadingCompleted).toBe(true));

    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(mockSetStep).toHaveBeenCalledWith(Steps.Error);
  });
});
