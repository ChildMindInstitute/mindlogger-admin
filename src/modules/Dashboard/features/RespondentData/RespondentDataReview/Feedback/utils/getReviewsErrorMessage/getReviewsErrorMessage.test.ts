// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getErrorMessage } from 'shared/utils';

import { getReviewsErrorMessage } from './getReviewsErrorMessage';

vi.mock('shared/utils', () => ({
  getErrorMessage: vi.fn(),
}));

describe('getReviewsErrorMessage', () => {
  const mockErrorMessage = 'Error message';
  const mockAxiosError = {
    isAxiosError: true,
    response: {
      data: { message: mockErrorMessage },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return the error message for reviewsError', () => {
    (getErrorMessage as jest.Mock).mockReturnValue(mockErrorMessage);

    const result = getReviewsErrorMessage(mockAxiosError, null);

    expect(getErrorMessage).toHaveBeenCalledWith(mockAxiosError);
    expect(result).toBe(mockErrorMessage);
  });

  test('should return the error message for reviewsFlowError', () => {
    (getErrorMessage as jest.Mock).mockReturnValue(mockErrorMessage);

    const result = getReviewsErrorMessage(null, mockAxiosError);

    expect(getErrorMessage).toHaveBeenCalledWith(mockAxiosError);
    expect(result).toBe(mockErrorMessage);
  });

  test('should return null if there are no errors', () => {
    const result = getReviewsErrorMessage(null, null);

    expect(getErrorMessage).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
