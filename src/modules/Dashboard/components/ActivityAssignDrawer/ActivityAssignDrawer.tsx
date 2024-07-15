import { useTranslation } from 'react-i18next';
import { Drawer, IconButton } from '@mui/material';

import { StyledFlexTopCenter, StyledHeadlineMedium } from 'shared/styles';
import { Svg } from 'shared/components';

import { ActivityAssignDrawerProps } from './ActivityAssignDrawer.types';
import { StyledActivityAssignHeader } from './ActivityAssignDrawer.styles';

const dataTestId = 'applet-activity-assign';

export const ActivityAssignDrawer = ({
  appletId,
  activityId,
  activityFlowId,
  sourceSubjectId,
  targetSubjectId,
  onClose,
  ...rest
}: ActivityAssignDrawerProps) => {
  const { t } = useTranslation('app');

  return (
    <Drawer
      anchor="right"
      data-testid={dataTestId}
      sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '96rem', maxWidth: '100%' } }}
      onClose={onClose}
      {...rest}
    >
      <StyledActivityAssignHeader>
        <StyledHeadlineMedium sx={{ mr: 'auto' }}>{t('assignActivity')}</StyledHeadlineMedium>
        <StyledFlexTopCenter sx={{ gap: 0.8 }}>
          <IconButton data-testid={`${dataTestId}-header-close`} onClick={onClose}>
            <Svg id="close" />
          </IconButton>
        </StyledFlexTopCenter>
      </StyledActivityAssignHeader>
    </Drawer>
  );
};
