import { PropsWithChildren } from 'react';

import { ParticipantActivityOrFlow } from 'api';

export type ActivityListItemProps = PropsWithChildren<{
  activityOrFlow: ParticipantActivityOrFlow;
  onClick?: () => void;
}>;
