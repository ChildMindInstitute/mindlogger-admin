import { useEffect } from 'react';

import { getLorisUsersVisitsApi, getLorisVisitsApi } from 'modules/Builder/api';

import { Steps } from '../UploadDataPopup.types';
import { formatData } from './LorisVisits.utils';
import { UseFetchVisitsDataProps } from './LorisVisits.types';

export const useFetchVisitsData = ({
  appletId,
  onSetIsLoading,
  setVisitsList,
  reset,
  setStep,
}: UseFetchVisitsDataProps) => {
  useEffect(() => {
    if (!appletId) return;

    const fetchData = async () => {
      try {
        onSetIsLoading(true);
        const [visitsResult, usersVisitsResult] = await Promise.all([
          getLorisVisitsApi(),
          getLorisUsersVisitsApi({ appletId }),
        ]);

        if (visitsResult?.data?.visits) {
          setVisitsList(visitsResult.data.visits);
        }

        if (usersVisitsResult?.data?.info) {
          const visitsForm = formatData(usersVisitsResult?.data?.info);
          reset({ visitsForm });
        }
      } catch (error) {
        console.error(error);
        setStep(Steps.Error);
      } finally {
        onSetIsLoading(false);
      }
    };

    fetchData();
  }, [appletId, onSetIsLoading, reset, setStep, setVisitsList]);
};
