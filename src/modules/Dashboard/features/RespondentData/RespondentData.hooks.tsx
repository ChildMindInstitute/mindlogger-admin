import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import { page } from 'resources';
import { users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store/hooks';
import { applet as appletState } from 'shared/state';

export const useRespondentDataSetup = () => {
  const { appletId, subjectId, activityId } = useParams();
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

  return {
    respondentDataTabs: [
      {
        labelKey: 'summary',
        id: 'respondent-data-summary',
        icon: <Svg id="chart" />,
        activeIcon: <Svg id="chart" />,
        path: generatePath(
          activityId
            ? page.appletParticipantActivityDetailsDataSummary
            : page.appletParticipantDataSummary,
          {
            appletId,
            subjectId,
            activityId,
          },
        ),
        'data-testid': 'respondents-summary-tab-summary',
      },
      {
        labelKey: 'responses',
        id: 'respondent-data-responses',
        icon: <Svg id="checkbox-outlined" />,
        activeIcon: <Svg id="checkbox-filled" />,
        path: generatePath(
          activityId
            ? page.appletParticipantActivityDetailsDataReview
            : page.appletParticipantDataReview,
          {
            appletId,
            subjectId,
            activityId,
          },
        ),
        'data-testid': 'respondents-summary-tab-review',
      },
    ],
  };
};
