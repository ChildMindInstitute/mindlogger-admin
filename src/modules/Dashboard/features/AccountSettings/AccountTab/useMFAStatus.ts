import { useState, useEffect } from 'react';

import { getUserDetailsApi } from 'modules/Dashboard/api';

export const useMFAStatus = (isModalOpen: boolean) => {
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [isLoadingMFAStatus, setIsLoadingMFAStatus] = useState(true);

  // Fetch MFA status whenever modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    const fetchMFAStatus = async () => {
      setIsLoadingMFAStatus(true);
      try {
        const response = await getUserDetailsApi();
        const userData = response.data.result;
        setIsMFAEnabled(userData.mfaEnabled || false);
      } catch (error) {
        console.error('Failed to fetch MFA status:', error);
        // Fallback to false if fetch fails
        setIsMFAEnabled(false);
      } finally {
        setIsLoadingMFAStatus(false);
      }
    };

    fetchMFAStatus();
  }, [isModalOpen]);

  const refetchMFAStatus = async () => {
    try {
      const response = await getUserDetailsApi();
      const userData = response.data.result;
      setIsMFAEnabled(userData.mfaEnabled || false);
    } catch (error) {
      console.error('Failed to refetch MFA status:', error);
    }
  };

  return {
    isMFAEnabled,
    setIsMFAEnabled,
    isLoadingMFAStatus,
    refetchMFAStatus,
  };
};
