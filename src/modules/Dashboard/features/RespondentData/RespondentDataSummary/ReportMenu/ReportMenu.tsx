import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  StyledBodyLarge,
  variables,
  StyledStickyHeadline,
  theme,
  StyledStickyHeader,
} from 'shared/styles';
import { RespondentDataContext } from 'modules/Dashboard/pages/RespondentData/RespondentData.context';
import {
  OFFSET_TO_SET_STICKY,
  OFFSET_TO_UNSET_STICKY,
  useHeaderSticky,
  useRespondentLabel,
} from 'shared/hooks';
import { ContentWithTooltip, DataTableItem } from 'shared/components';

import { StyledMenu } from '../../RespondentData.styles';
import { StyleContainer, StyledActivity, StyledHeaderContainer } from './ReportMenu.styles';
import { ReportMenuProps } from './ReportMenu.types';

export const ReportMenu = ({ activities }: ReportMenuProps) => {
  const { t } = useTranslation();
  const respondentLabel = useRespondentLabel();
  const { selectedActivity, setSelectedActivity } = useContext(RespondentDataContext);
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(
    containerRef,
    OFFSET_TO_SET_STICKY / 2,
    OFFSET_TO_UNSET_STICKY / 2,
  );

  return (
    <StyledMenu ref={containerRef} data-testid="report-menu" sx={{ p: 0 }}>
      <StyledStickyHeader
        isSticky={isHeaderSticky}
        sx={{
          p: theme.spacing(0, 4),
        }}
      >
        <StyledHeaderContainer isSticky={isHeaderSticky}>
          <StyledStickyHeadline isSticky={isHeaderSticky} color={variables.palette.on_surface}>
            {t('activities')}
          </StyledStickyHeadline>
          <ContentWithTooltip
            value={respondentLabel}
            item={{ label: respondentLabel } as DataTableItem}
            styles={{ position: 'relative', padding: 0 }}
          />
        </StyledHeaderContainer>
      </StyledStickyHeader>
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
