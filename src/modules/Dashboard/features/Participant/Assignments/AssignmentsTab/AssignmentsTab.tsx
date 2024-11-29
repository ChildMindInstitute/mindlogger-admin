import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLocation, useParams } from 'react-router-dom';
import React from 'react';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { StyledFlexColumn, StyledFlexTopCenter, StyledMaybeEmpty } from 'shared/styles';

import { StyledToggleButton, StyledToggleButtonGroup } from './AssignmentsTab.styles';
import { AssignmentsTabProps } from './AssignmentsTab.types';

export const AssignmentsTab = ({
  children,
  isLoadingCounts,
  aboutParticipantCount,
  byParticipantCount,
}: AssignmentsTabProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });
  const { appletId, subjectId } = useParams();
  const { pathname } = useLocation();

  const buttons = [
    {
      key: 'aboutParticipant',
      path: generatePath(page.appletParticipantDetails, {
        appletId,
        subjectId,
      }),
      icon: <Svg id="about-participant" width="18" height="18" fill="currentColor" />,
      label: (
        <StyledFlexTopCenter>
          {t('aboutParticipant')}
          {' • '}
          <StyledMaybeEmpty isLoading={isLoadingCounts}>{aboutParticipantCount}</StyledMaybeEmpty>
        </StyledFlexTopCenter>
      ),
      dataTestId: 'participant-details-filter-about-participant',
    },
    {
      key: 'byParticipant',
      path: generatePath(page.appletParticipantDetailsByParticipant, {
        appletId,
        subjectId,
      }),
      icon: <Svg id="by-participant" width="18" height="18" fill="currentColor" />,
      label: (
        <StyledFlexTopCenter>
          {t('byParticipant')}
          {' • '}
          <StyledMaybeEmpty isLoading={isLoadingCounts}>{byParticipantCount}</StyledMaybeEmpty>
        </StyledFlexTopCenter>
      ),
      dataTestId: 'participant-details-filter-by-participant',
    },
  ];

  return (
    <StyledFlexColumn sx={{ px: 3.2, py: 2.4, gap: 3.2, flex: 1, overflow: 'auto' }}>
      <StyledToggleButtonGroup exclusive>
        {buttons.map(({ key, path, icon, label, dataTestId }) => (
          <StyledToggleButton
            key={key}
            component={Link}
            to={path}
            value={key}
            selected={pathname === path}
            data-testid={dataTestId}
          >
            {icon} {label}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>

      <StyledFlexColumn sx={{ gap: 4.8, flex: 1 }}>{children}</StyledFlexColumn>
    </StyledFlexColumn>
  );
};
