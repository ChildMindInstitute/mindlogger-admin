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
import { useEncryptionStorage } from 'shared/hooks';
import { UnlockAppletPopup } from 'modules/Dashboard/features/Respondents/Popups/UnlockAppletPopup';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';
import { useGetAppletActivitiesQuery } from 'modules/Dashboard/api/apiSlice';

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

  const { data, isLoading } = useGetAppletActivitiesQuery(
    { params: { appletId: appletId as string } },
    { skip: !appletId },
  );

  const activityOrFlow = useMemo((): Activity | HydratedActivityFlow | undefined => {
    const activities: Activity[] = data?.activitiesDetails ?? [];
    const activityFlows: ActivityFlow[] = data?.appletDetail?.activityFlows ?? [];

    if (activityId) {
      return activities.find((activity) => getEntityKey(activity) === activityId);
    } else if (activityFlowId) {
      const flow = activityFlows.find(
        (flow: ActivityFlow) => getEntityKey(flow) === activityFlowId,
      );

      return flow && hydrateActivityFlows([flow], activities)[0];
    }
  }, [data, activityId, activityFlowId]);

  const { useSubject } = users;
  const { result: subject } = useSubject() ?? {};

  const { respondentDataTabs } = useRespondentDataSetup();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  const canViewData = hasPermissionToViewData(appletRoles) && hasEncryptionCheck;

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
