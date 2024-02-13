import { renderHook, waitFor } from '@testing-library/react';

import * as MixpanelFunc from 'shared/utils/mixpanel';

import { useTransferOwnership } from './useTransferOwnership';

describe('useTransferOwnership', () => {
  test('should return initial values', () => {
    const { result } = renderHook(useTransferOwnership);

    expect(result.current).toStrictEqual({
      transferOwnershipSuccessVisible: false,
      setTransferOwnershipSuccessVisible: expect.any(Function),
      isSubmitted: false,
      setIsSubmitted: expect.any(Function),
      emailTransfered: '',
      setEmailTransfered: expect.any(Function),
      handleSubmit: expect.any(Function),
    });
  });

  test('should change isSubmitted to true if handleSubmit triggered', async () => {
    const { result } = renderHook(useTransferOwnership);

    result.current.handleSubmit();

    await waitFor(() =>
      expect(result.current).toStrictEqual({
        transferOwnershipSuccessVisible: false,
        setTransferOwnershipSuccessVisible: expect.any(Function),
        isSubmitted: true,
        setIsSubmitted: expect.any(Function),
        emailTransfered: '',
        setEmailTransfered: expect.any(Function),
        handleSubmit: expect.any(Function),
      }),
    );
  });

  test('should change transferOwnershipSuccessVisible accorging to emailTransfered updates', async () => {
    const mixpanelTrack = jest.spyOn(MixpanelFunc.Mixpanel, 'track');
    const { result } = renderHook(useTransferOwnership);

    result.current.setEmailTransfered('test@email.com');

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        transferOwnershipSuccessVisible: true,
        setTransferOwnershipSuccessVisible: expect.any(Function),
        isSubmitted: false,
        setIsSubmitted: expect.any(Function),
        emailTransfered: 'test@email.com',
        setEmailTransfered: expect.any(Function),
        handleSubmit: expect.any(Function),
      });
      expect(mixpanelTrack).toHaveBeenNthCalledWith(1, 'Invitation sent successfully');
    });

    result.current.setTransferOwnershipSuccessVisible(false);
    result.current.setEmailTransfered('');

    await waitFor(() => {
      expect(result.current).toStrictEqual({
        transferOwnershipSuccessVisible: false,
        setTransferOwnershipSuccessVisible: expect.any(Function),
        isSubmitted: false,
        setIsSubmitted: expect.any(Function),
        emailTransfered: '',
        setEmailTransfered: expect.any(Function),
        handleSubmit: expect.any(Function),
      });
      expect(mixpanelTrack).toBeCalledTimes(1);
    });
  });
});
