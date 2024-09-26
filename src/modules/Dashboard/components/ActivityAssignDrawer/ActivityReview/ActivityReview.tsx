import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Box, IconButton } from '@mui/material';

import {
  StyledEllipsisText,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopBaseline,
  StyledFlexTopCenter,
  StyledPlainLinkBtn,
  StyledTitleLargish,
  StyledTitleMedium,
  variables,
} from 'shared/styles';
import { Svg } from 'shared/components';
import { AssignmentCounts } from 'modules/Dashboard/components';

import { AssignmentsTable } from '../AssignmentsTable';
import { ActivityReviewProps } from './ActivityReview.types';
import { ActivitiesList } from '../ActivitiesList';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './ActivityReview.styles';

const ASSIGNMENTS_LIMIT = 10;

export const ActivityReview = ({
  activity,
  flow,
  isSingleActivity,
  index,
  assignments,
  onDelete,
  'data-testid': dataTestId,
  ...dropdownProps
}: ActivityReviewProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });
  const [showAllAssignments, setShowAllAssignments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(index === 0 || isSingleActivity);

  const assignmentCounts = useMemo(() => {
    const counts = { selfReports: 0, multiInformant: 0 };
    for (const assignment of assignments) {
      if (assignment.respondentSubjectId === assignment.targetSubjectId) {
        counts.selfReports++;
      } else {
        counts.multiInformant++;
      }
    }

    return counts;
  }, [assignments]);

  useEffect(() => {
    if (isSingleActivity) setIsExpanded(true);
  }, [isSingleActivity]);

  return (
    <StyledAccordion
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
      disabled={isSingleActivity}
      data-testid={dataTestId}
    >
      <StyledAccordionSummary>
        <Svg id="email-outlined" width={18} height={18} />
        <StyledFlexTopCenter component={StyledTitleMedium} sx={{ gap: 1.2 }}>
          <Box sx={{ width: '12rem' }}>{t('assignmentTitle', { index: index + 1 })}</Box>
          {!isExpanded && (
            <>
              <StyledEllipsisText sx={{ maxWidth: '19.2rem' }}>
                {(activity ?? flow).name}
              </StyledEllipsisText>
              <Box color={variables.palette.outline}>•</Box>
              <Box>{t('numberAssignees', { count: assignments.length })}</Box>
            </>
          )}
        </StyledFlexTopCenter>

        {!isSingleActivity && (
          <StyledFlexAllCenter sx={{ ml: 'auto', gap: 1.6 }}>
            <IconButton
              onClick={(e) => {
                onDelete(activity ?? flow);
                e.stopPropagation();
              }}
              data-testid={`${dataTestId}-${index}-delete-button`}
            >
              <Svg aria-label={t('deleteAssignment')} id="trash" fill={variables.palette.red} />
            </IconButton>

            <IconButton data-toggle>
              <Svg
                aria-label={t('reviewToggleButton')}
                id="navigate-down"
                fill={variables.palette.on_surface_variant}
              />
            </IconButton>
          </StyledFlexAllCenter>
        )}
      </StyledAccordionSummary>

      <StyledAccordionDetails>
        <StyledFlexColumn sx={{ gap: 1.6 }}>
          <StyledTitleLargish>{t('activitySubtitle')}</StyledTitleLargish>
          <ActivitiesList
            key={(activity ?? flow).id}
            activities={activity ? [activity] : []}
            flows={flow ? [flow] : []}
            isReadOnly
            data-testid={`${dataTestId}-activities-list`}
          />
        </StyledFlexColumn>

        <StyledFlexColumn sx={{ gap: 1.6 }}>
          <StyledFlexTopBaseline sx={{ gap: 1.6 }}>
            <StyledTitleLargish>{t('respondentsSubtitle')}</StyledTitleLargish>
            <AssignmentCounts {...assignmentCounts} />
          </StyledFlexTopBaseline>

          <AssignmentsTable
            {...dropdownProps}
            assignments={showAllAssignments ? assignments : assignments.slice(0, ASSIGNMENTS_LIMIT)}
            isReadOnly
            data-testid={`${dataTestId}-assignments-table`}
          />

          {!showAllAssignments && assignments.length > ASSIGNMENTS_LIMIT && (
            <StyledPlainLinkBtn onClick={() => setShowAllAssignments(true)} sx={{ mr: 'auto' }}>
              <StyledTitleLargish as="span" color="inherit">
                {t('showMore', { count: assignments.length - ASSIGNMENTS_LIMIT })}
              </StyledTitleLargish>
            </StyledPlainLinkBtn>
          )}
        </StyledFlexColumn>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
