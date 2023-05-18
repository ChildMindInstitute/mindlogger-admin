import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { workspaces } from 'redux/modules';
import { EmptyTable, Spinner } from 'shared/components';

import { WithPermissionsProps } from './WithPermissions.types';

export const WithPermissions = ({ forbiddenRoles, children }: WithPermissionsProps) => {
  const { t } = useTranslation('app');

  const priorityRoleData = workspaces.usePriorityRoleData();
  const priorityRole = priorityRoleData?.data;
  const isLoading = priorityRoleData?.status === 'loading' || priorityRoleData?.status === 'idle';

  if (isLoading) {
    return (
      <Box sx={{ position: 'relative', height: '100%' }}>
        <Spinner />
      </Box>
    );
  }

  if (priorityRole && forbiddenRoles?.includes(priorityRole)) {
    return <EmptyTable width="25rem">{t('noPermissions')}</EmptyTable>;
  }

  return children;
};
