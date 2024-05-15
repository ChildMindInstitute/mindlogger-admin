import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { EmptyState } from 'shared/components';
import { workspaces } from 'shared/state';
import { StyledBody } from 'shared/styles';
import { Mixpanel } from 'shared/utils';
import { RespondentData as RespondentDataFeature } from 'modules/Dashboard/features/RespondentData';

import { hasPermissionToViewData } from './RespondentData.utils';

export const RespondentData = () => {
  const { t } = useTranslation();
  const { appletId } = useParams();

  useEffect(() => {
    Mixpanel.trackPageView('Data Viz');
  }, []);

  const rolesData = workspaces.useRolesData();
  const appletRoles = appletId ? rolesData?.data?.[appletId] : undefined;

  if (!hasPermissionToViewData(appletRoles))
    return <EmptyState width="25rem">{t('noPermissions')}</EmptyState>;

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <RespondentDataFeature />
    </StyledBody>
  );
};

export default RespondentData;
