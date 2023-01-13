import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { Svg, Row } from 'components';
import { useAppDispatch } from 'redux/store';
import { users } from 'redux/modules';
import { getErrorMessage } from 'utils/errors';
import { useBreadcrumbs } from 'hooks';

import { AddUserForm } from './AddUserForm';
import { InvitationsTable } from './InvitationsTable';
import { Invitation } from './AddUser.types';
import { LinkGenerator } from './LinkGenerator';

export const AddUser = () => {
  const { id } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<Row[]>([]);

  useBreadcrumbs([
    {
      icon: <Svg id="users-outlined" width="15" height="15" />,
      label: t('addUser'),
    },
  ]);

  const getInvitationsHandler = async () => {
    try {
      if (id) {
        const { getInvitations } = users.thunk;
        const result = await dispatch(getInvitations({ id }));

        if (getInvitations.fulfilled.match(result)) {
          const rows = result.payload.data.map(
            ({ MRN, firstName, lastName, role, created, _id }: Invitation) => ({
              secretUserId: {
                content: () => MRN,
                value: MRN,
              },
              firstName: {
                content: () => firstName,
                value: firstName,
              },
              lastName: {
                content: () => lastName,
                value: lastName,
              },
              role: {
                content: () => role,
                value: role,
              },
              invitationLink: {
                content: () => `${process.env.APP_WEB_URI || ''}/invitation/${_id}`, // TODO: Implement web environments
                value: _id,
              },
              dateTimeInvited: {
                content: () => format(new Date(created), 'yyyy-MM-dd HH:mm:ss'),
                value: created,
              },
            }),
          );
          setRows(rows);
        }
      }
    } catch (e) {
      return getErrorMessage(e);
    }
  };

  useEffect(() => {
    getInvitationsHandler();
  }, []);

  return (
    <>
      <AddUserForm getInvitationsHandler={getInvitationsHandler} />
      <InvitationsTable rows={rows} />
      <LinkGenerator />
    </>
  );
};
