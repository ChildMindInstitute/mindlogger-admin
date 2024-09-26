import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLocation, useParams } from 'react-router-dom';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles';
import { ActivityAssignDrawer, ActivityUnassignDrawer } from 'modules/Dashboard/components';

import { StyledToggleButton, StyledToggleButtonGroup } from './AssignmentsTab.styles';
import { AssignmentsTabHandle, AssignmentsTabProps } from './AssignmentsTab.types';

export const AssignmentsTab = forwardRef<AssignmentsTabHandle, AssignmentsTabProps>(
  ({ children, onRefetch, ...rest }, ref) => {
    useImperativeHandle(ref, () => ({
      showAssign: () => setShowActivityAssign(true),
      showUnassign: () => setShowActivityUnassign(true),
    }));

    const { t } = useTranslation('app', { keyPrefix: 'participantDetails' });
    const { appletId, subjectId } = useParams();
    const { pathname } = useLocation();
    const [showActivityAssign, setShowActivityAssign] = useState(false);
    const [showActivityUnassign, setShowActivityUnassign] = useState(false);

    const handleCloseDrawer = (shouldRefetch?: boolean) => {
      setShowActivityAssign(false);
      setShowActivityUnassign(false);
      if (shouldRefetch) onRefetch?.();
    };

    const buttons = [
      {
        key: 'aboutParticipant',
        path: generatePath(page.appletParticipantDetails, {
          appletId,
          subjectId,
        }),
        icon: <Svg id="about-participant" width="18" height="18" fill="currentColor" />,
        // TODO: add total count of activities/flows to label
        // https://mindlogger.atlassian.net/browse/M2-7890
        label: t('aboutParticipant'),
      },
      {
        key: 'byParticipant',
        path: generatePath(page.appletParticipantDetailsByParticipant, {
          appletId,
          subjectId,
        }),
        icon: <Svg id="by-participant" width="18" height="18" fill="currentColor" />,
        // TODO: add total count of activities/flows to label
        // https://mindlogger.atlassian.net/browse/M2-7890
        label: t('byParticipant'),
      },
    ];

    return (
      <>
        <StyledFlexColumn sx={{ mx: 3.2, my: 2.4, gap: 3.2, flex: 1 }}>
          <StyledToggleButtonGroup exclusive>
            {buttons.map(({ key, path, icon, label }) => (
              <StyledToggleButton
                key={key}
                component={Link}
                to={path}
                value={key}
                selected={pathname === path}
              >
                {icon} {label}
              </StyledToggleButton>
            ))}
          </StyledToggleButtonGroup>

          <StyledFlexColumn sx={{ gap: 4.8, flex: 1 }}>{children}</StyledFlexColumn>
        </StyledFlexColumn>

        <ActivityAssignDrawer
          appletId={appletId}
          open={showActivityAssign}
          onClose={handleCloseDrawer}
          {...rest}
        />
        <ActivityUnassignDrawer
          appletId={appletId}
          open={showActivityUnassign}
          onClose={handleCloseDrawer}
        />
      </>
    );
  },
);
