import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import { Svg, Row } from 'shared/components';
import { getErrorMessage } from 'shared/utils';
import { useBreadcrumbs } from 'shared/hooks';
import { DateFormats } from 'shared/consts';
import { getInvitationsApi } from 'api';
import { StyledHeadlineLarge, theme } from 'shared/styles';

import { AddUserForm } from './AddUserForm';
import { InvitationsTable } from './InvitationsTable';
import { LinkGenerator } from './LinkGenerator';

export const AddUser = () => {
  const { t } = useTranslation('app');
  const [rows, setRows] = useState<Row[]>([]);

  useBreadcrumbs([
    {
      icon: <Svg id="users-outlined" width="15" height="15" />,
      label: t('addUser'),
    },
  ]);

  const getInvitationsHandler = async () => {
    try {
      const { data } = await getInvitationsApi();
      if (data?.result?.length) {
        const rows = data?.result.map(
          ({ MRN, firstName, lastName, role, email, _id, created }: any) => ({
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
            email: {
              content: () => email,
              value: email,
            },
            invitationLink: {
              content: () => `${process.env.APP_WEB_URI || ''}/invitation/${_id}`, // TODO: Implement web environments
              value: _id,
            },
            dateTimeInvited: {
              content: () => format(new Date(created), DateFormats.YearMonthDayHoursMinutesSeconds),
              value: created,
            },
          }),
        );
        setRows(rows);
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
      <StyledHeadlineLarge sx={{ mb: theme.spacing(4.8) }}>{t('addUsers')}</StyledHeadlineLarge>
      <AddUserForm getInvitationsHandler={getInvitationsHandler} />
      <InvitationsTable rows={rows} />
      <LinkGenerator />
    </>
  );
};
