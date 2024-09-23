import { useTranslation } from 'react-i18next';
import { generatePath, Link, useLocation, useParams } from 'react-router-dom';
import { PropsWithChildren } from 'react';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { StyledFlexColumn } from 'shared/styles';

import { StyledToggleButton, StyledToggleButtonGroup } from './AssignmentsTab.styles';

export const AssignmentsTab = ({ children }: PropsWithChildren) => {
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
    <StyledFlexColumn sx={{ mx: 3.2, my: 2.4, gap: 3.2 }}>
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

      <StyledFlexColumn sx={{ gap: 4.8 }}>{children}</StyledFlexColumn>
    </StyledFlexColumn>
  );
};
