import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getActivityApi } from 'api';
import { EmptyState, LinkedTabs } from 'shared/components';
import { applet as appletState } from 'shared/state';
import { users, workspaces } from 'redux/modules';
import { hasPermissionToViewData } from 'modules/Dashboard/pages/RespondentData/RespondentData.utils';
import { useAsync } from 'shared/hooks';

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
  const { useSubject } = users;
  const { result: subject } = useSubject() ?? {};

  const { respondentDataTabs } = useRespondentDataSetup();
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: defaultRespondentDataFormValues,
  });
  const { execute, value } = useAsync(getActivityApi);
  const { result: activity } = value?.data ?? {};

  const canViewData = hasPermissionToViewData(appletRoles);

  useEffect(() => {
    if (activityId) {
      execute({ activityId });
    }
  }, [activityId, execute]);

  return (
    <FormProvider {...methods}>
      {appletData && subject && (
        <RespondentDataHeader
          dataTestid={'respondents-summary-back-to-applet'}
          applet={appletData}
          subject={subject}
          activity={activity}
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
