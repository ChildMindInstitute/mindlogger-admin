import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import {
  getActivityIdentifiersApi,
  getFlowIdentifiersApi,
  getActivityVersionsApi,
  getFlowVersionsApi,
  Identifier,
  Version,
} from 'api';
import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { GetIdentifiersVersions } from '../../RespondentDataSummary.types';
import { useDecryptedIdentifiers } from '../useDecryptedIdentifiers';

export const useDatavizSummaryRequests = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedIdentifiers = useDecryptedIdentifiers();
  const { setValue } = useFormContext<RespondentsDataFormValues>();

  const setIdentifiers = async (identifiers: Identifier[]) => {
    if (!getDecryptedIdentifiers) return;

    const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers);
    setValue('identifiers', decryptedIdentifiers);
  };

  const setVersions = (versions: Version[]) => {
    const versionsFilter = versions.map(({ version }) => ({
      id: version,
      label: version,
    }));
    setValue('versions', versionsFilter);
    setValue('apiVersions', versions);
  };

  const getIdentifiersVersions = async ({ entity }: GetIdentifiersVersions) => {
    try {
      if (!appletId || !respondentId || !entity?.hasAnswer) return;

      if (entity.isFlow) {
        const flowId = entity.id;
        const identifiers = await getFlowIdentifiersApi({
          appletId,
          flowId,
          respondentId,
        });
        await setIdentifiers(identifiers.data.result);

        const versions = await getFlowVersionsApi({ appletId, flowId });
        setVersions(versions.data.result);

        return;
      }

      if (entity?.isPerformanceTask) return;

      const activityId = entity.id;
      const identifiers = await getActivityIdentifiersApi({
        appletId,
        activityId,
        respondentId,
      });
      await setIdentifiers(identifiers.data.result);

      const versions = await getActivityVersionsApi({ appletId, activityId });
      setVersions(versions.data.result);
    } catch (error) {
      console.warn(error);
    }
  };

  return { getIdentifiersVersions };
};
