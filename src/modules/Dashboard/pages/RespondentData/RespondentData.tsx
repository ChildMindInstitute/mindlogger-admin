import { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { DatavizActivity, getSummaryActivitiesApi } from 'api';
import { users, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import { EmptyState, LinkedTabs, Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import { useAsync } from 'shared/hooks';
import { StyledBody, StyledDirectoryUpButton } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils/mixpanel';

import { defaultSummaryFormFiltersValues } from './RespondentData.const';
import { RespondentDataContext } from './RespondentData.context';
import { useRespondentDataTabs } from './RespondentData.hooks';
import { SummaryFiltersForm } from './RespondentData.types';

export const RespondentData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { appletId, respondentId } = useParams();
  const dispatch = useAppDispatch();

  const { ownerId } = workspaces.useData() || {};
  const respondentDataTabs = useRespondentDataTabs();

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi, result => {
    setSummaryActivities(result?.data?.result || []);
  });

  const [summaryActivities, setSummaryActivities] = useState<DatavizActivity[]>();
  const [selectedActivity, setSelectedActivity] = useState<DatavizActivity>();

  const methods = useForm<SummaryFiltersForm>({
    defaultValues: defaultSummaryFormFiltersValues,
  });

  const navigateUp = () =>
    navigate(
      generatePath(page.appletRespondents, {
        appletId,
      }),
    );

  useEffect(() => {
    methods.reset();
  }, [selectedActivity]);

  useEffect(() => {
    if (!appletId || !respondentId || !ownerId) return;

    getSummaryActivities({
      appletId,
      respondentId,
    });

    const { getRespondentDetails } = users.thunk;

    dispatch(
      getRespondentDetails({
        ownerId,
        appletId,
        respondentId,
      }),
    );
  }, [appletId, respondentId, ownerId]);

  useEffect(() => {
    Mixpanel.trackPageView('Data Viz');
  }, []);

  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  if (appletRoles?.[0] === Roles.Coordinator) return <EmptyState width="25rem">{t('noPermissions')}</EmptyState>;

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={navigateUp}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
        data-testid="respondents-summary-back-to-applet">
        {t('appletPage')}
      </StyledDirectoryUpButton>
      <RespondentDataContext.Provider
        value={{ summaryActivities, setSummaryActivities, selectedActivity, setSelectedActivity }}>
        <FormProvider {...methods}>
          <LinkedTabs tabs={respondentDataTabs} />
        </FormProvider>
      </RespondentDataContext.Provider>
    </StyledBody>
  );
};
