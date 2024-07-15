import { useTranslation } from 'react-i18next';
import { Drawer, IconButton } from '@mui/material';
import { useState } from 'react';

import { StyledFlexTopCenter, StyledHeadlineMedium } from 'shared/styles';
import { Svg } from 'shared/components';

import { ActivityAssignDrawerProps } from './ActivityAssignDrawer.types';
import { StyledActivityAssignHeader } from './ActivityAssignDrawer.styles';
import { HelpPopup } from './HelpPopup';
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
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  return (
    <Drawer
      anchor="right"
      data-testid={dataTestId}
      sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '96rem', maxWidth: '100%' } }}
      onClose={onClose}
      {...rest}
    >
      <StyledActivityAssignHeader>
        <StyledHeadlineMedium sx={{ mr: 'auto' }}>{t('title')}</StyledHeadlineMedium>
        <StyledFlexTopCenter sx={{ gap: 0.8 }}>
          <IconButton
            data-testid={`${dataTestId}-header-help`}
            onClick={() => setShowHelpPopup(true)}
          >
            <Svg id="help-outlined" />
          </IconButton>
          <IconButton data-testid={`${dataTestId}-header-close`} onClick={onClose}>
            <Svg id="close" />
          </IconButton>
        </StyledFlexTopCenter>
      </StyledActivityAssignHeader>

      <HelpPopup
        isVisible={showHelpPopup}
        setIsVisible={setShowHelpPopup}
        data-testid={dataTestId}
      />
    </Drawer>
  );
};
