import { useEffect, useState } from 'react';

import { getLorisUsersVisitsApi, getLorisVisitsApi } from 'modules/Builder/api';

import { Steps } from '../UploadDataPopup.types';
import { formatData } from './LorisVisits.utils';
import { UseFetchVisitsDataProps } from './LorisVisits.types';

export const useFetchVisitsData = ({
  appletId,
  onSetIsLoading,
  setVisitsList,
  setVisitsData,
  reset,
  setStep,
}: UseFetchVisitsDataProps) => {
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  useEffect(() => {
    if (!appletId) return;

    const fetchData = async () => {
      try {
        onSetIsLoading(true);
        setIsLoadingCompleted(false);
        const [visitsResult, usersVisitsResult] = await Promise.all([
          getLorisVisitsApi(),
          getLorisUsersVisitsApi({ appletId }),
        ]);

        if (visitsResult?.data?.visits) {
          setVisitsList(visitsResult.data.visits);
        }

        if (usersVisitsResult?.data?.info) {
          const visitsForm = formatData(usersVisitsResult?.data?.info);
          setVisitsData(visitsForm);
          reset({ visitsForm });
        }
      } catch (error) {
        console.error(error);
        setStep(Steps.Error);
      } finally {
        onSetIsLoading(false);
        setIsLoadingCompleted(true);
      }
    };

    fetchData();
  }, [appletId, onSetIsLoading, reset, setStep, setVisitsData, setVisitsList]);

  return { isLoadingCompleted };
};
