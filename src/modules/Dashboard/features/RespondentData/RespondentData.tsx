import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { EmptyState, LinkedTabs, Spinner } from 'shared/components';
import { applet as appletState } from 'shared/state';
import { Activity, ActivityFlow, users, workspaces } from 'redux/modules';
import { hasPermissionToViewData } from 'modules/Dashboard/pages/RespondentData/RespondentData.utils';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { getEntityKey } from 'shared/utils';
import { useAsync, useEncryptionStorage } from 'shared/hooks';
import { getAppletActivitiesApi } from 'api';
import { UnlockAppletPopup } from 'modules/Dashboard/features/Respondents/Popups/UnlockAppletPopup';

import { useRespondentDataSetup } from './RespondentData.hooks';
import { RespondentsDataFormValues } from './RespondentData.types';
import { RespondentDataContextProvider } from './RespondentDataContext';
import { defaultRespondentDataFormValues } from './RespondentData.const';
import { RespondentDataHeader } from './RespondentDataHeader';

export const RespondentData = () => {
  const { t } = useTranslation('app');
  const { appletId, activityId, activityFlowId } = useParams();

  const { getAppletPrivateKey } = useEncryptionStorage();
  const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');
  const [viewDataPopupVisible, setViewDataPopupVisible] = useState(false);

  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  const { useAppletData } = appletState;
  const { result: appletData } = useAppletData() ?? {};

  const { execute: getActivitiesAndFlows, isLoading, value } = useAsync(getAppletActivitiesApi);
  const activityOrFlow = useMemo((): Activity | HydratedActivityFlow | undefined => {
    const activities: Activity[] = value?.data?.result?.activitiesDetails ?? [];
    const activityFlows: ActivityFlow[] = value?.data?.result?.appletDetail?.activityFlows ?? [];

    if (activityId) {
      return activities.find((activity) => getEntityKey(activity) === activityId);
    } else if (activityFlowId) {
      const flow = activityFlows.find(
        (flow: ActivityFlow) => getEntityKey(flow) === activityFlowId,
      );

      // Hydrate flow with activities
      if (flow) {
        const { activityIds = [] } = flow;

        return {
          ...flow,
          activities: activityIds
            .map((activityId: string) => activities.find(({ id }) => id === activityId))
            .filter(Boolean) as Activity[],
        };
      }
    }
  }, [value, activityId, activityFlowId]);

  const { useSubject } = users;
  const { result: subject } = useSubject() ?? {};

  const { respondentDataTabs } = useRespondentDataSetup();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  const canViewData = hasPermissionToViewData(appletRoles) && hasEncryptionCheck;

  useEffect(() => {
    if (appletId) {
      getActivitiesAndFlows({ params: { appletId } });
    }
  }, [appletId, getActivitiesAndFlows]);

  useEffect(() => {
    if (!hasEncryptionCheck) {
      setViewDataPopupVisible(true);

      return;
    }
  }, [hasEncryptionCheck]);

  return (
    <FormProvider {...methods}>
      <Box sx={{ position: 'relative' }}>
        {isLoading && <Spinner />}

        {appletData && subject && activityOrFlow && (
          <RespondentDataHeader
            dataTestid={'respondents-summary-back-to-applet'}
            applet={appletData}
            subject={subject}
            activityOrFlow={activityOrFlow}
          />
        )}
      </Box>

      {canViewData ? (
        <RespondentDataContextProvider>
          <LinkedTabs tabs={respondentDataTabs} isCentered={false} />
        </RespondentDataContextProvider>
      ) : (
        <EmptyState width="25rem">{t('noPermissions')}</EmptyState>
      )}
      <UnlockAppletPopup
        appletId={appletId || ''}
        popupVisible={viewDataPopupVisible}
        setPopupVisible={setViewDataPopupVisible}
      />
    </FormProvider>
  );
};
