import { PropsWithChildren, ReactNode } from 'react';

import { ParticipantActivityOrFlow } from 'api';

export type ActivityListItemProps = PropsWithChildren<{
  activityOrFlow: ParticipantActivityOrFlow;
  onClick?: () => void;
  onClickToggleExpandedView?: (isExpanded: boolean) => void;
  expandedView?: ReactNode;
  isLoadingExpandedView?: boolean;
}>;
