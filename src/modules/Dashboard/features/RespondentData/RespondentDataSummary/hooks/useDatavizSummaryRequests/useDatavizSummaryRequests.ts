import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { getIdentifiersApi, getVersionsApi } from 'api';
import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { GetIdentifiersVersions } from '../../RespondentDataSummary.types';
import { useDecryptedIdentifiers } from '../useDecryptedIdentifiers';

export const useDatavizSummaryRequests = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedIdentifiers = useDecryptedIdentifiers();
  const { setValue } = useFormContext<RespondentsDataFormValues>();

  const getIdentifiersVersions = async ({ activity }: GetIdentifiersVersions) => {
    try {
      if (!appletId || !respondentId || !activity?.hasAnswer || activity?.isPerformanceTask) return;

      const identifiers = await getIdentifiersApi({
        appletId,
        activityId: activity.id,
        targetSubjectId: respondentId,
      });
      if (!getDecryptedIdentifiers) return;
      const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers.data.result);
      setValue('identifiers', decryptedIdentifiers);

      const versions = await getVersionsApi({ appletId, activityId: activity.id });
      const versionsFilter = versions.data.result?.map(({ version }) => ({
        id: version,
        label: version,
      }));
      setValue('versions', versionsFilter);
      setValue('apiVersions', versions.data.result);
    } catch (error) {
      console.warn(error);
    }
  };

  return { getIdentifiersVersions };
};
