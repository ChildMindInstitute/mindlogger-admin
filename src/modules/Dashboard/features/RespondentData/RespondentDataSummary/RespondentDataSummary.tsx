import { useContext, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAsync, useBreadcrumbs } from 'shared/hooks';
import { Spinner } from 'shared/components';
import { useDecryptedIdentifiers } from 'modules/Dashboard/hooks';
import { StyledContainer, StyledFlexAllCenter } from 'shared/styles';
import { Version, getIdentifiersApi, getVersionsApi } from 'api';
import { RespondentDataContext } from 'modules/Dashboard/pages/RespondentData/RespondentData.context';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';

import { ReportMenu } from './ReportMenu';
import { Report } from './Report';
import { StyledReportContainer, StyledEmptyReview } from './RespondentDataSummary.styles';
import { Identifier } from './RespondentDataSummary.types';
import { getEmptyState, getUniqueIdentifierOptions } from './RespondentDataSummary.utils';

export const RespondentDataSummary = () => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();
  const { summaryActivities, selectedActivity } = useContext(RespondentDataContext);
  const { setValue } = useFormContext<SummaryFiltersForm>();

  const [isLoading, setIsLoading] = useState(true);
  const [versions, setVersions] = useState<Version[]>([]);
  const [identifiers, setIdentifiers] = useState<Identifier[]>([]);

  const getDecryptedIdentifiers = useDecryptedIdentifiers();

  const { execute: getIdentifiers } = useAsync(getIdentifiersApi);
  const { execute: getVersions } = useAsync(getVersionsApi);

  useBreadcrumbs([
    {
      icon: 'chart',
      label: t('summary'),
    },
  ]);

  const reportContent = useMemo(() => {
    if (selectedActivity && isLoading) return <Spinner />;
    if (!selectedActivity || !selectedActivity.hasAnswer || selectedActivity.isPerformanceTask) {
      return (
        <StyledFlexAllCenter sx={{ height: '100%' }}>
          <StyledEmptyReview>{getEmptyState(selectedActivity)}</StyledEmptyReview>
        </StyledFlexAllCenter>
      );
    }

    return <Report activity={selectedActivity!} identifiers={identifiers} versions={versions} />;
  }, [selectedActivity, isLoading, t]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        if (
          !appletId ||
          !selectedActivity ||
          !selectedActivity?.hasAnswer ||
          selectedActivity?.isPerformanceTask
        )
          return;

        setIsLoading(true);
        const identifiers = await getIdentifiers({
          appletId,
          activityId: selectedActivity.id,
        });
        const decryptedIdentifiers = getDecryptedIdentifiers(identifiers.data.result);
        const identifiersFilter = getUniqueIdentifierOptions(decryptedIdentifiers);
        setValue('identifier', identifiersFilter);
        setIdentifiers(decryptedIdentifiers);

        const versions = await getVersions({ appletId, activityId: selectedActivity.id });
        const versionsFilter = versions.data.result?.map(({ version }) => ({
          id: version,
          label: version,
        }));
        setValue('versions', versionsFilter);
        setVersions(versions.data.result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiltersData();
  }, [selectedActivity, appletId, respondentId]);

  return (
    <StyledContainer>
      {!!summaryActivities?.length && (
        <>
          <ReportMenu activities={summaryActivities} />
          <StyledReportContainer>{reportContent}</StyledReportContainer>
        </>
      )}
    </StyledContainer>
  );
};
