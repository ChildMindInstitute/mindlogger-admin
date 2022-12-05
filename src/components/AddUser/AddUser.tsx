import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { Row } from 'components/Table';
import { useAppDispatch } from 'redux/store';
import { users } from 'redux/modules';

import { AddUserForm } from './AddUserForm';
import { InvitationsTable } from './InvitationsTable';
import { Invitation } from './AddUser.types';

export const AddUser = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const { getInvitations } = users.thunk;
    (async () => {
      const result = await dispatch(getInvitations({ id: id as string }));

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
              content: () => `${process.env.VUE_APP_WEB_URI || ''}/invitation/${_id}`, // TODO: Remove '' after configuring environments
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
    })();
  }, [dispatch, id]);

  return (
    <>
      <AddUserForm />
      <InvitationsTable rows={rows} />
    </>
  );
};
