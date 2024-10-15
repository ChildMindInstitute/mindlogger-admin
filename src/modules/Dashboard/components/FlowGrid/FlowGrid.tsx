import { useCallback, useMemo, useState } from 'react';

import { FlowSummaryCard } from 'modules/Dashboard/components/FlowSummaryCard';
import { DataExportPopup } from 'modules/Dashboard/features/Respondents/Popups';
import { StyledFlexColumn } from 'shared/styles';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';

import { FlowGridProps } from './FlowGrid.types';
import { useFlowGridMenu } from './FlowGrid.hooks';

export const FlowGrid = ({
  applet,
  activities = [],
  flows = [],
  subject,
  onClickAssign,
  onClickUnassign,
  onClickItem,
  'data-testid': dataTestId,
  ...otherProps
}: FlowGridProps) => {
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [flowId, setFlowId] = useState<string>();
  const { getActionsMenu, TakeNowModal } = useFlowGridMenu({
    appletId: applet?.id,
    hasParticipants: true,
    subject,
    testId: dataTestId,
    onClickExportData: useCallback((flowId: string) => {
      setFlowId(flowId);
      setShowExportPopup(true);
    }, []),
    onClickAssign,
    onClickUnassign,
  });
  const hydratedFlows = useMemo(() => hydrateActivityFlows(flows, activities), [activities, flows]);

  return (
    <>
      <StyledFlexColumn
        component="ul"
        sx={{ gap: 0.8, m: 0, p: 0 }}
        data-testid={`${dataTestId}-flow-grid`}
        {...otherProps}
      >
        {hydratedFlows.map((flow) => (
          <FlowSummaryCard
            flow={flow}
            component="li"
            menuItems={getActionsMenu({ flow })}
            key={flow.id}
            onClick={onClickItem}
            data-testid={`${dataTestId}-flow-card`}
          />
        ))}
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
