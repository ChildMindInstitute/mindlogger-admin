import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { getErrorMessage } from 'shared/utils';
import { useBreadcrumbs } from 'shared/hooks';
import { getInvitationsApi } from 'api';
import { StyledHeadlineLarge, theme } from 'shared/styles';

import { AddUserForm } from './AddUserForm';
import { InvitationsTable } from './InvitationsTable';
import { LinkGenerator } from './LinkGenerator';
import { Invitations } from './AddUser.types';

export const AddUser = () => {
  const { t } = useTranslation('app');
  const [invitations, setInvitations] = useState<Invitations | null>(null);

  useBreadcrumbs([
    {
      icon: <Svg id="users-outlined" width="15" height="15" />,
      label: t('addUser'),
    },
  ]);

  const getInvitationsHandler = async () => {
    try {
      const { data } = await getInvitationsApi({ params: {} });

      data && setInvitations(data);
    } catch (e) {
      return getErrorMessage(e);
    }
  };

  useEffect(() => {
    getInvitationsHandler();
  }, []);

  return (
    <>
      <StyledHeadlineLarge sx={{ mb: theme.spacing(4.8) }}>{t('addUsers')}</StyledHeadlineLarge>
      <AddUserForm getInvitationsHandler={getInvitationsHandler} />
      <InvitationsTable invitations={invitations} setInvitations={setInvitations} />
      <LinkGenerator />
    </>
  );
};
