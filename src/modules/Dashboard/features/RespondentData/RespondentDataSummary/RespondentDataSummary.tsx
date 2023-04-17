import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Activity } from 'redux/modules';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledContainer } from 'shared/styles';

import { mockedActivities } from '../mock';
import { Report } from './Report';
import { ReportMenu } from './ReportMenu';

export const RespondentDataSummary = () => {
  const { t } = useTranslation();
  const activities = mockedActivities;
  const [selectedActivity, setSelectedActivity] = useState<Activity>(activities[0]);
  useBreadcrumbs([
    {
      icon: 'chart',
      label: t('summary'),
    },
  ]);

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
