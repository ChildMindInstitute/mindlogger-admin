import { ReactNode } from 'react';

import { ParticipantActivityOrFlow } from 'api';

export type ActivityListItemProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  onClickToggleExpandedView?: (isExpanded: boolean) => void;
  expandedView?: ReactNode;
  isLoadingExpandedView?: boolean;
  /**
   * For non-expandable list items: to make the list item clickable, in `children`, include a button
   * with class `primary-button`. That button will have a pseudo-element added that will make the
   * whole list item clickable.
   */
  children?: ReactNode;
};
