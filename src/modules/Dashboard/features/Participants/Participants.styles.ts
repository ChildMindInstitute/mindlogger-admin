import { Button, styled } from '@mui/material';

import { DashboardTable } from 'modules/Dashboard/components';

import { ParticipantsColumnsWidth } from './Participants.const';

export const AddParticipantButton = styled(Button)`
  min-width: 15.3rem;
`;

export const ParticipantsTable = styled(DashboardTable)`
  td,
  th {
    min-width: 13rem;
  }

  th:nth-of-type(1),
  td:nth-of-type(1) {
    min-width: ${ParticipantsColumnsWidth.Pin};
  }

  th:nth-of-type(2),
  td:nth-of-type(2) {
    min-width: ${ParticipantsColumnsWidth.Pin};
  }

  th:nth-of-type(6),
  td:nth-of-type(6) {
    min-width: ${ParticipantsColumnsWidth.AccountType};
  }

  th:last-child,
  td:last-child {
    min-width: ${ParticipantsColumnsWidth.Menu};
  }
`;
