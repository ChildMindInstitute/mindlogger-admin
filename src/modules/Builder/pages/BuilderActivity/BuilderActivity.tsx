import { Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath, Outlet } from 'react-router-dom';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { page } from 'resources';
import { LinkedTabs, Svg } from 'shared/components';
import { variables } from 'shared/styles';
import { StyledDirectoryUpButton, StyledTitleSmall } from 'shared/styles/styledComponents';

import { StyledBuilderActivityBody, StyledConfig, StyledWrapper } from './BuilderActivity.styles';
import { getActivityTabs } from './BuilderActivity.utils';

export const BuilderActivity = () => {
  const { t } = useTranslation();
  const { activityId, appletId } = useParams();
  const navigate = useNavigate();

  const { activity, fieldName = '' } = useCurrentActivity();
  const { trigger, getFieldState } = useCustomFormContext();
  const isPerformanceTask = activity?.isPerformanceTask;

  const navigateToActivities = () => navigate(generatePath(page.builderAppletActivities, { appletId }));

  const handleBackBtnClick = async () => {
    await trigger();
    navigateToActivities();
  };

  const hasAppletErrors = !!getFieldState('activityFlows').error || !!getFieldState('displayName').error;
  const tabErrors = {
    hasAboutActivityErrors: !!getFieldState(`${fieldName}.name`).error,
    hasActivityItemsErrors: !!getFieldState(`${fieldName}.items`).error,
    hasActivitySubscalesErrors: !!getFieldState(`${fieldName}.subscaleSetting`).error,
    hasActivityReportsErrors: !!getFieldState(`${fieldName}.scoresAndReports`).error,
    hasActivityItemsFlowErrors: !!getFieldState(`${fieldName}.conditionalLogic`).error,
  };

  return (
    <StyledBuilderActivityBody>
      <StyledDirectoryUpButton
        variant="text"
        onClick={handleBackBtnClick}
        startIcon={<Svg id="directory-up" width="18" height="18" />}>
        {t('activities')}
        <Badge variant="dot" invisible={!hasAppletErrors} color="error" />
      </StyledDirectoryUpButton>
      {activityId &&
        (isPerformanceTask ? (
          <>
            <StyledWrapper>
              <StyledConfig>
                <Svg id="configure-filled" />
                <StyledTitleSmall color={variables.palette.primary}>{t('configure')}</StyledTitleSmall>
              </StyledConfig>
            </StyledWrapper>
            <Outlet />
          </>
        ) : (
          <LinkedTabs tabs={getActivityTabs({ activityId, appletId }, tabErrors)} isBuilder />
        ))}
    </StyledBuilderActivityBody>
  );
};
