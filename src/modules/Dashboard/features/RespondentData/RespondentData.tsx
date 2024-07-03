import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState, LinkedTabs } from 'shared/components';
import { applet as appletState } from 'shared/state';
import { users, workspaces } from 'redux/modules';
import { getEntityKey } from 'shared/utils';
import { hasPermissionToViewData } from 'modules/Dashboard/pages/RespondentData/RespondentData.utils';

import { useRespondentDataSetup } from './RespondentData.hooks';
import { RespondentsDataFormValues } from './RespondentData.types';
import { RespondentDataContextProvider } from './RespondentDataContext';
import { defaultRespondentDataFormValues } from './RespondentData.const';
import { RespondentDataHeader } from './RespondentDataHeader';

export const RespondentData = () => {
  const { t } = useTranslation('app');
  const { appletId, activityId } = useParams();
  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  const { useAppletData } = appletState;
  const { result: appletData } = useAppletData() ?? {};
  const currentActivity = useMemo(
    () => appletData?.activities?.find((activity) => getEntityKey(activity) === activityId),
    [activityId, appletData?.activities],
  );
  const { useSubject } = users;
  const { result: subject } = useSubject() ?? {};

  const { respondentDataTabs } = useRespondentDataSetup();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });

  const canViewData = hasPermissionToViewData(appletRoles);

  return (
    <FormProvider {...methods}>
      {appletData && subject && (
        <RespondentDataHeader
          dataTestid={'respondents-summary-back-to-applet'}
          applet={appletData}
          subject={subject}
          activity={currentActivity}
        />
      )}

      {canViewData ? (
        <RespondentDataContextProvider>
          <LinkedTabs tabs={respondentDataTabs} isCentered={false} />
        </RespondentDataContextProvider>
      ) : (
        <EmptyState width="25rem">{t('noPermissions')}</EmptyState>
      )}
    </FormProvider>
  );
};
