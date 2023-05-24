import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAsync, useBreadcrumbs } from 'shared/hooks';
import { getInvitationsApi } from 'api';
import { StyledHeadlineLarge, theme } from 'shared/styles';
import { DEFAULT_INVITATIONS_ROWS_PER_PAGE } from 'shared/components';
import { workspaces } from 'redux/modules';

import { AddUserForm } from './AddUserForm';
import { InvitationsTable } from './InvitationsTable';
import { LinkGenerator } from './LinkGenerator';
import { Invitations } from './AddUser.types';

export const AddUser = () => {
  const { appletId } = useParams();
  const { t } = useTranslation('app');

  const [invitations, setInvitations] = useState<Invitations | null>(null);

  const priorityRoleData = workspaces.usePriorityRoleData();

  const { execute } = useAsync(getInvitationsApi, (res) => res?.data && setInvitations(res.data));
  useBreadcrumbs([
    {
      icon: 'users-outlined',
      label: t('addUser'),
    },
  ]);

  const getInvitationsHandler = () => {
    execute({
      params: { limit: DEFAULT_INVITATIONS_ROWS_PER_PAGE, appletId },
    });
  };

  useEffect(() => {
    getInvitationsHandler();
  }, []);

  return (
    <>
      <StyledHeadlineLarge sx={{ mb: theme.spacing(4.8) }}>{t('addUsers')}</StyledHeadlineLarge>
      <AddUserForm
        getInvitationsHandler={getInvitationsHandler}
        priorityRole={priorityRoleData?.data}
      />
      <InvitationsTable invitations={invitations} setInvitations={setInvitations} />
      <LinkGenerator />
    </>
  );
};
