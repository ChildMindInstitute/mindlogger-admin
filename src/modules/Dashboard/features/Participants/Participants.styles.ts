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

  th:nth-child(1),
  td:nth-child(1) {
    min-width: ${ParticipantsColumnsWidth.Pin};
  }

  th:nth-child(2),
  td:nth-child(2) {
    min-width: ${ParticipantsColumnsWidth.Pin};
  }

  th:nth-child(6),
  td:nth-child(6) {
    min-width: ${ParticipantsColumnsWidth.AccountType};
  }

  th:last-child,
  td:last-child {
    min-width: ${ParticipantsColumnsWidth.Menu};
  }
`;
