import { useState } from 'react';

import { banners } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Mixpanel } from 'shared/utils/mixpanel';

export const useTransferOwnership = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleSendInvitation =
    ({ callback, bannerTestId }: { callback?: () => void; bannerTestId: string }) =>
    (email: string) => {
      callback?.();

      dispatch(
        banners.actions.addBanner({
          key: 'TransferOwnershipSuccessBanner',
          bannerProps: {
            email,
            'data-testid': bannerTestId,
          },
        }),
      );

      Mixpanel.track('Invitation sent successfully');
    };

  return {
    isSubmitted,
    setIsSubmitted,
    handleSubmit,
    handleSendInvitation,
  };
};
