import { useState, useEffect } from 'react';

import { Mixpanel } from 'shared/utils/mixpanel';

export const useTransferOwnership = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailTransfered, setEmailTransfered] = useState('');
  const [transferOwnershipSuccessVisible, setTransferOwnershipSuccessVisible] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (!emailTransfered) return;

    setTransferOwnershipSuccessVisible(true);
    Mixpanel.track('Invitation sent successfully');
  }, [emailTransfered]);

  return {
    transferOwnershipSuccessVisible,
    setTransferOwnershipSuccessVisible,
    isSubmitted,
    setIsSubmitted,
    emailTransfered,
    setEmailTransfered,
    handleSubmit,
  };
};
