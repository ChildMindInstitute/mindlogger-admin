import { useEffect } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { Svg } from 'shared/components/Svg';
import { page } from 'resources';
import { users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store/hooks';

export const useRespondentDataSetup = () => {
  const { appletId, subjectId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!subjectId) return;

    const { getSubjectDetails } = users.thunk;

    dispatch(
      getSubjectDetails({
        subjectId,
      }),
    );
  }, [subjectId, dispatch]);

  return {
    respondentDataTabs: [
      {
        labelKey: 'summary',
        id: 'respondent-data-summary',
        icon: <Svg id="chart" />,
        activeIcon: <Svg id="chart" />,
        path: generatePath(page.appletParticipantDataSummary, {
          appletId,
          subjectId,
        }),
        'data-testid': 'respondents-summary-tab-summary',
      },
      {
        labelKey: 'responses',
        id: 'respondent-data-responses',
        icon: <Svg id="checkbox-outlined" />,
        activeIcon: <Svg id="checkbox-filled" />,
        path: generatePath(page.appletParticipantDataReview, {
          appletId,
          subjectId,
        }),
        'data-testid': 'respondents-summary-tab-review',
      },
    ],
  };
};
