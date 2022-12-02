import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { users } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Row, Table } from 'components/Table';
import { getHeadCells } from './InvitationsTable.const';
import { StyledTitle } from './Invitationstable.styles';
import { Invitation } from './InvitationsTable.types';

export const InvitationsTable = () => {
  const { t } = useTranslation('app');
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
              content: () => `${process.env.VUE_APP_WEB_URI || ''}/invitation/${_id}`, //todo
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
      <StyledTitle>{t('pendingInvitations')}</StyledTitle>
      <Table columns={getHeadCells(t)} rows={rows} orderBy={'created'} />
    </>
  );
};
