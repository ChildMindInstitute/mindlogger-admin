import { useTranslation } from 'react-i18next';

import { ActivityAssignmentStatus } from 'api';
import { Chip, ChipShape, Svg, Tooltip } from 'shared/components';
import { StyledFlexTopCenter, variables } from 'shared/styles';

import { ActivityStatusColors, ActivityStatusIcons } from './ActivityStatusChip.const';

export const ActivityStatusChip = ({ status }: { status: ActivityAssignmentStatus }) => {
  const { t } = useTranslation('app');

  return (
    <Tooltip tooltipTitle={t(`activityStatus.${status}Tooltip`)} maxWidth="50rem">
      <StyledFlexTopCenter>
        <Chip
          color={ActivityStatusColors[status]}
          size="small"
          icon={<Svg aria-hidden id={ActivityStatusIcons[status]} height={18} width={18} />}
          shape={ChipShape.Rounded}
          title={t(`activityStatus.${status}`)}
          sx={status === 'hidden' ? { backgroundColor: variables.palette.orange_light } : undefined}
        />
      </StyledFlexTopCenter>
    </Tooltip>
  );
};
