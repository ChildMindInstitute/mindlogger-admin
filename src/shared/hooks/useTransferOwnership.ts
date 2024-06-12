import { useState } from 'react';

import { banners } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Mixpanel } from 'shared/utils/mixpanel';

export const useTransferOwnership = (appletId?: string) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleSendInvitation = (callback?: () => void) => (email: string) => {
    callback?.();

    dispatch(
      banners.actions.addBanner({
        key: 'TransferOwnershipSuccessBanner',
        bannerProps: { email },
      }),
    );

    Mixpanel.track('Invitation sent successfully', {
      'Applet ID': appletId,
    });
  };

  return {
    isSubmitted,
    setIsSubmitted,
    handleSubmit,
    handleSendInvitation,
  };
};
