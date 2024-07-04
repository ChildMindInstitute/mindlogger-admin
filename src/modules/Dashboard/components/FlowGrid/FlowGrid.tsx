import { useCallback, useState } from 'react';

import { FlowSummaryCard } from 'modules/Dashboard/components/FlowSummaryCard';
import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { Activity } from 'redux/modules';
import { StyledFlexColumn } from 'shared/styles';

import { FlowGridProps } from './FlowGrid.types';
import { useFlowGridMenu } from './FlowGrid.hooks';

export const FlowGrid = ({
  applet,
  activities = [],
  flows = [],
  subject,
  'data-testid': dataTestId,
  ...otherProps
}: FlowGridProps) => {
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [flowId, setFlowId] = useState<string>();
  const { getActionsMenu, TakeNowModal } = useFlowGridMenu({
    appletId: applet?.id,
    hasParticipants: true,
    subject,
    onClickExportData: useCallback((flowId: string) => {
      setFlowId(flowId);
      setShowExportPopup(true);
    }, []),
  });

  return (
    <>
      <StyledFlexColumn
        component="ul"
        sx={{ gap: 0.8, m: 0, p: 0 }}
        data-testid={`${dataTestId}-flow-grid`}
        {...otherProps}
      >
        {flows.map((flow) => {
          const { id, activityIds = [] } = flow;
          const hydratedFlow = {
            ...flow,
            activities: activityIds
              .map((activityId) => activities.find(({ id }) => id === activityId))
              .filter(Boolean) as Activity[],
          };

          return (
            <FlowSummaryCard
              flow={hydratedFlow}
              component="li"
              menuItems={getActionsMenu({ flow: hydratedFlow })}
              key={id}
              data-testid={`${dataTestId}-flow-card`}
            />
          );
        })}
      </StyledFlexColumn>

      <TakeNowModal />

      {showExportPopup && (
        <DataExportPopup
          chosenAppletData={applet ?? null}
          filters={{ flowId, targetSubjectId: subject?.id }}
          isAppletSetting
          popupVisible={showExportPopup}
          setPopupVisible={() => {
            setShowExportPopup(false);
            setFlowId(undefined);
          }}
        />
      )}
    </>
  );
};
