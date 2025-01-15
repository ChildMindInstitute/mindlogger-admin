import { ReactNode } from 'react';

import { ParticipantActivityOrFlow } from 'api';

export type ActivityListItemProps = {
  activityOrFlow: ParticipantActivityOrFlow;
  onClickToggleExpandedView?: (isExpanded: boolean) => void;
  expandedView?: ReactNode;
  isLoadingExpandedView?: boolean;
  /**
   * For non-expandable list items:
   *
   * If it's desirable for a button being passed in the `children` to cause the entire list item to
   * be clickable, make sure to assign it the CSS class `primary-button`. It's advised to add the
   * `disableRipple` prop to such a button for a better user experience.
   */
  children?: ReactNode;
  dataTestId: string;
};
