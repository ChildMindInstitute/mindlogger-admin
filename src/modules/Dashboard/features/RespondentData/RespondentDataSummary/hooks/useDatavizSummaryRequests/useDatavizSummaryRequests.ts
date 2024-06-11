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
import { useDataSummaryContext } from '../../DataSummaryContext';

export const useDatavizSummaryRequests = () => {
  const { appletId, respondentId } = useParams();
  const getDecryptedIdentifiers = useDecryptedIdentifiers();
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const { setIdentifiers, setApiVersions } = useDataSummaryContext();

  const setDecryptedIdentifiers = async (identifiers: Identifier[]) => {
    if (!getDecryptedIdentifiers) return;

    const decryptedIdentifiers = await getDecryptedIdentifiers(identifiers);
    setIdentifiers(decryptedIdentifiers);
  };

  const setVersions = (versions: Version[]) => {
    const versionsFilter = versions.map(({ version }) => ({
      id: version,
      label: version,
    }));
    setValue('versions', versionsFilter);
    setApiVersions(versions);
  };

  const getIdentifiersVersions = async ({ entity }: GetIdentifiersVersions) => {
    try {
      if (!appletId || !respondentId || !entity?.hasAnswer) return;

      if (entity.isFlow) {
        const flowId = entity.id;
        const identifiers = await getFlowIdentifiersApi({
          appletId,
          flowId,
          targetSubjectId: respondentId,
        });
        await setDecryptedIdentifiers(identifiers.data.result);

        const versions = await getFlowVersionsApi({ appletId, flowId });
        setVersions(versions.data.result);

        return;
      }

      if (entity?.isPerformanceTask) return;

      const activityId = entity.id;
      const identifiers = await getActivityIdentifiersApi({
        appletId,
        activityId,
        targetSubjectId: respondentId,
      });
      await setDecryptedIdentifiers(identifiers.data.result);

      const versions = await getActivityVersionsApi({ appletId, activityId });
      setVersions(versions.data.result);
    } catch (error) {
      console.warn(error);
    }
  };

  return { getIdentifiersVersions };
};
