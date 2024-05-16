import { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { StyledBodyLarge, variables } from 'shared/styles';

import { StyledMenu } from '../../RespondentData.styles';
import { setDateRangeFormValues } from '../utils/setDateRangeValues';
import { ActivityOrFlow, RespondentsDataFormValues } from '../../RespondentData.types';
import { StyledContainer, StyledItem, StyledTitle } from './ReportMenu.styles';
import { setDefaultFormValues } from './ReportMenu.utils';
import { ReportMenuProps } from './ReportMenu.types';
import { StickyHeader } from './StickyHeader';

export const ReportMenu = ({
  activities,
  flows,
  getIdentifiersVersions,
  fetchAnswers,
  setIsLoading,
}: ReportMenuProps) => {
  const { t } = useTranslation('app');
  const containerRef = useRef<HTMLElement | null>(null);
  const { setValue } = useFormContext<RespondentsDataFormValues>();
  const [selectedEntity] = useWatch({ name: ['selectedEntity'] });

  const handleSelectEntity = async (entity: ActivityOrFlow) => {
    setValue('selectedEntity', entity);
    setDateRangeFormValues(setValue, entity.lastAnswerDate);
    setDefaultFormValues(setValue);

    setIsLoading(true);
    await getIdentifiersVersions({ entity });
    await fetchAnswers({ entity });
    setIsLoading(false);
  };

  return (
    <StyledMenu ref={containerRef} data-testid="report-menu" sx={{ p: 0 }}>
      <StickyHeader containerRef={containerRef} />
      {!!flows.length && (
        <StyledContainer>
          <StyledTitle>{t('activityFlows')}</StyledTitle>
          {flows.map((flow, index) => (
            <StyledItem
              key={String(flow.id)}
              isSelected={selectedEntity?.id === flow.id}
              onClick={() => handleSelectEntity({ ...flow, isFlow: true })}
              data-testid={`respondents-summary-flow-${index}`}
            >
              <StyledBodyLarge color={variables.palette.on_surface}>{flow.name}</StyledBodyLarge>
            </StyledItem>
          ))}
        </StyledContainer>
      )}
      {!!activities.length && (
        <StyledContainer>
          <StyledTitle>{t('activities')}</StyledTitle>
          {activities?.map((activity, index) => (
            <StyledItem
              key={String(activity.id)}
              isSelected={selectedEntity?.id === activity.id}
              onClick={() => handleSelectEntity({ ...activity, isFlow: false })}
              data-testid={`respondents-summary-activity-${index}`}
            >
              <StyledBodyLarge color={variables.palette.on_surface}>
                {activity.name}
              </StyledBodyLarge>
            </StyledItem>
          ))}
        </StyledContainer>
      )}
    </StyledMenu>
  );
};
