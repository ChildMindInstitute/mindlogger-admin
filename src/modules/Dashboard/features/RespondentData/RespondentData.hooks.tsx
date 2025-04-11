import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store/hooks';
import { page } from 'resources';
import { Svg } from 'shared/components/Svg';
import { applet as appletState } from 'shared/state';

export const useRespondentDataSetup = () => {
  const { appletId, subjectId, activityId, activityFlowId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!subjectId || !appletId) return;

    const { getSubjectDetails } = users.thunk;
    const { getApplet } = appletState.thunk;
    dispatch(
      getApplet({
        appletId,
      }),
    );

    dispatch(
      getSubjectDetails({
        subjectId,
      }),
    );
  }, [appletId, subjectId, dispatch]);

  const routes: string[] = [];
  if (activityId) {
    routes.push(
      page.appletParticipantActivityDetailsDataSummary,
      page.appletParticipantActivityDetailsDataReview,
    );
  } else if (activityFlowId) {
    routes.push(
      page.appletParticipantActivityDetailsFlowDataSummary,
      page.appletParticipantActivityDetailsFlowDataReview,
    );
  } else {
    // TODO: Remove deprecated routes once tests catch on (M2-8891)
    // https://mindlogger.atlassian.net/browse/M2-8891
    routes.push(page.appletParticipantDataSummary, page.appletParticipantDataReview);
  }

  return {
    respondentDataTabs: [
      {
        labelKey: 'summary',
        id: 'respondent-data-summary',
        icon: <Svg id="chart" />,
        activeIcon: <Svg id="chart" />,
        path: generatePath(routes[0], {
          appletId,
          subjectId,
          activityId,
          activityFlowId,
        }),
        'data-testid': 'respondents-summary-tab-summary',
      },
      {
        labelKey: 'responses',
        id: 'respondent-data-responses',
        icon: <Svg id="checkbox-outlined" />,
        activeIcon: <Svg id="checkbox-filled" />,
        path: generatePath(routes[1], {
          appletId,
          subjectId,
          activityId,
          activityFlowId,
        }),
        'data-testid': 'respondents-summary-tab-review',
      },
    ],
  };
};
