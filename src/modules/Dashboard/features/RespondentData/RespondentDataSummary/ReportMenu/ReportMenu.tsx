import { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { StyledBodyLarge, variables } from 'shared/styles';
import { DatavizActivity } from 'api';

import { StyledMenu } from '../../RespondentData.styles';
import { setDateRangeFormValues } from '../utils/setDateRangeValues';
import { RespondentsDataFormValues } from '../../RespondentData.types';
import { StyleContainer, StyledActivity } from './ReportMenu.styles';
import { setDefaultFormValues } from './ReportMenu.utils';
import { ReportMenuProps } from './ReportMenu.types';
import { StickyHeader } from './StickyHeader';

export const ReportMenu = ({
  activities,
  getIdentifiersVersions,
  fetchAnswers,
  setIsLoading,
}: ReportMenuProps) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const [selectedActivity] = useWatch({ name: ['selectedActivity'] });

  const handleActivitySelect = async (activity: DatavizActivity) => {
    setValue('selectedActivity', activity);
    setDateRangeFormValues(setValue, activity.lastAnswerDate);
    setDefaultFormValues(setValue);

    setIsLoading(true);
    await getIdentifiersVersions({ activity });
    await fetchAnswers({ activity });
    setIsLoading(false);
  };

  return (
    <StyledMenu ref={containerRef} data-testid="report-menu" sx={{ p: 0 }}>
      <StickyHeader containerRef={containerRef} />
      {activities?.length && (
        <StyleContainer>
          {activities?.map((activity, index) => (
            <StyledActivity
              key={String(activity.id)}
              isSelected={selectedActivity?.id === activity.id}
              onClick={() => handleActivitySelect(activity)}
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
