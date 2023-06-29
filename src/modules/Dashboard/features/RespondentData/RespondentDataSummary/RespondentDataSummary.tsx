import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAsync, useBreadcrumbs } from 'shared/hooks';
import { Spinner, Svg } from 'shared/components';
import { useDecryptedIdentifiers } from 'modules/Dashboard/hooks';
import { StyledContainer, StyledTitleLarge, variables } from 'shared/styles';
import {
  DatavizActivity,
  Version,
  getIdentifiersApi,
  getSummaryActivitiesApi,
  getVersionsApi,
} from 'api';

import { ReportMenu } from './ReportMenu';
import { Report } from './Report';
import { StyledEmptyContainer, StyledEmptyReview } from './RespondentDataSummary.styles';
import { Identifier } from './RespondentDataSummary.types';

export const RespondentDataSummary = () => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<DatavizActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<DatavizActivity>();
  const [versions, setVersions] = useState<Version[]>([]);
  const [identifiers, setIdentifiers] = useState<Identifier[]>([]);

  const getDecryptedIdentifiers = useDecryptedIdentifiers();

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi);
  const { execute: getIdentifiers } = useAsync(getIdentifiersApi);
  const { execute: getVersions } = useAsync(getVersionsApi);

  useBreadcrumbs([
    {
      icon: 'chart',
      label: t('summary'),
    },
  ]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!appletId || !respondentId) return;
      try {
        const result = await getSummaryActivities({
          appletId,
        });
        setActivities(result.data?.result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [appletId, respondentId]);

  useEffect(() => {
    if (!appletId || !respondentId) return;
    const fetchFiltersData = async () => {
      if (!appletId || !selectedActivity) return;
      try {
        setIsLoading(true);
        const identifiers = await getIdentifiers({
          appletId,
          activityId: selectedActivity.id,
        });
        setIdentifiers(getDecryptedIdentifiers(identifiers.data.result));
        const versions = await getVersions({ appletId, activityId: selectedActivity.id });
        setVersions(versions.data.result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiltersData();
  }, [selectedActivity, appletId, respondentId]);

  return (
    <StyledContainer>
      {isLoading && <Spinner />}
      {!!activities.length && (
        <>
          <ReportMenu
            activities={activities}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
          />
          {!isLoading && selectedActivity && !!versions.length ? (
            <Report activity={selectedActivity} identifiers={identifiers} versions={versions} />
          ) : (
            <StyledEmptyContainer>
              <StyledEmptyReview>
                <Svg id="data" width="60" height="73" />
                <StyledTitleLarge color={variables.palette.outline}>
                  {t('emptyReview')}
                </StyledTitleLarge>
              </StyledEmptyReview>
            </StyledEmptyContainer>
          )}
        </>
      )}
    </StyledContainer>
  );
};
