import { useState } from 'react';

import { Activity } from 'redux/modules';
import { StyledContainer } from 'shared/styles';

import { mockedActivities } from '../mock';
import { Report } from './Report';
import { ReportMenu } from './ReportMenu';

export const RespondentDataSummary = () => {
  const activities = mockedActivities;
  const [selectedActivity, setSelectedActivity] = useState<Activity>(activities[0]);

  return (
    <StyledContainer>
      <ReportMenu
        activities={activities}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
      />
      <Report activity={selectedActivity} />
    </StyledContainer>
  );
};
