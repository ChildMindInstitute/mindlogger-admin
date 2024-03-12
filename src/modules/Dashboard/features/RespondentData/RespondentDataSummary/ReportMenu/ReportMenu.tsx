import { useContext, useRef } from 'react';

import { StyledBodyLarge, variables } from 'shared/styles';
import { RespondentDataContext } from 'modules/Dashboard/pages/RespondentData/RespondentData.context';

import { StyledMenu } from '../../RespondentData.styles';
import { StyleContainer, StyledActivity } from './ReportMenu.styles';
import { ReportMenuProps } from './ReportMenu.types';
import { StickyHeader } from './StickyHeader/StickyHeader';

export const ReportMenu = ({ activities }: ReportMenuProps) => {
  const { selectedActivity, setSelectedActivity } = useContext(RespondentDataContext);
  const containerRef = useRef<HTMLElement | null>(null);

  return (
    <StyledMenu ref={containerRef} data-testid="report-menu" sx={{ p: 0 }}>
      <StickyHeader containerRef={containerRef} />
      {activities?.length && (
        <StyleContainer>
          {activities?.map((activity, index) => (
            <StyledActivity
              key={String(activity.id)}
              isSelected={selectedActivity?.id === activity.id}
              onClick={() => setSelectedActivity(activity)}
              data-testid={`respondents-summary-activity-${index}`}
            >
              <StyledBodyLarge color={variables.palette.on_surface}>
                {activity.name}
              </StyledBodyLarge>
            </StyledActivity>
          ))}
        </StyleContainer>
      )}
    </StyledMenu>
  );
};
