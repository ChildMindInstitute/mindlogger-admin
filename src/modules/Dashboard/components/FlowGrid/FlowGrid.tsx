import { StyledFlexColumn } from 'shared/styles';
import { FlowSummaryCard } from 'modules/Dashboard/components/FlowSummaryCard';
import { Activity } from 'redux/modules';

import { FlowGridProps } from './FlowGrid.types';
import { useFlowGridMenu } from './FlowGrid.hooks';

export const FlowGrid = ({
  appletId,
  activities = [],
  flows = [],
  subject,
  ...otherProps
}: FlowGridProps) => {
  const { getActionsMenu, TakeNowModal } = useFlowGridMenu({
    appletId,
    hasParticipants: true,
    subject,
  });

  return (
    <>
      <StyledFlexColumn component="ul" sx={{ gap: 0.8, m: 0, p: 0 }} {...otherProps}>
        {flows.map((flow) => {
          const { id, name, description, activityIds = [] } = flow;

          return (
            <FlowSummaryCard
              activities={
                activityIds
                  .map((activityId) => activities.find(({ id }) => id === activityId))
                  .filter(Boolean) as Activity[]
              }
              component="li"
              description={description}
              menuItems={getActionsMenu({ flow })}
              key={id}
              name={name}
            />
          );
        })}
      </StyledFlexColumn>

      <TakeNowModal />
    </>
  );
};
