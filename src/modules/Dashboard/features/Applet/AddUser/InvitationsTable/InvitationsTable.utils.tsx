import { format } from 'date-fns';

import { HeadCell } from 'shared/types/table';
import { capitalize } from 'shared/utils';
import { DateFormats } from 'shared/consts';
import i18n from 'i18n';

import { InvitationWithTooltip } from './InvitationWithTooltip';
import { GetInvitationsTableRows } from './InvitationsTable.types';

const { t } = i18n;

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'secretUserId',
    label: t('secretUserId'),
    enableSort: false,
  },
  {
    id: 'firstName',
    label: t('firstName'),
    enableSort: false,
  },
  {
    id: 'lastName',
    label: t('lastName'),
    enableSort: false,
  },
  {
    id: 'role',
    label: t('role'),
    enableSort: false,
  },
  {
    id: 'email',
    label: t('email'),
    enableSort: false,
  },
  {
    id: 'invitationLink',
    label: t('invitationLink'),
    enableSort: false,
  },
  {
    id: 'dateTimeInvited',
    label: t('dateTimeInvited'),
    enableSort: false,
  },
];

export const getInvitationsTableRows = ({
  invitations,
  setOpenTooltipIndex,
  handleTooltipClose,
  openTooltipIndex,
}: GetInvitationsTableRows) =>
  invitations?.result.map(
    ({ secretUserId, firstName, lastName, role, email, key, createdAt }, index) => {
      const capitalizedRole = capitalize(role);
      const invitationLink = `${process.env.REACT_APP_WEB_URI || ''}/invitation/${key}`;

      return {
        secretUserId: {
          content: () => secretUserId ?? '',
          value: secretUserId ?? '',
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
          content: () => capitalizedRole,
          value: capitalizedRole,
        },
        email: {
          content: () => email,
          value: email,
        },
        invitationLink: {
          content: () => invitationLink,
          value: key,
          onClick: () => setOpenTooltipIndex(index),
          contentWithTooltip: (
            <InvitationWithTooltip
              open={openTooltipIndex === index}
              onClose={handleTooltipClose}
              invitationLink={invitationLink}
            />
          ),
        },
        dateTimeInvited: {
          content: () =>
            `${format(new Date(`${createdAt}Z`), DateFormats.YearMonthDayHoursMinutesSeconds)}`,
          value: createdAt,
        },
      };
    },
  );
