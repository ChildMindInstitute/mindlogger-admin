import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@mui/material';

import { StyledDirectoryUpButton } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { page } from 'resources';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { getActivityTabs } from './BuilderActivity.utils';
import { StyledBuilderActivityBody } from './BuilderActivity.styles';

export const BuilderActivity = () => {
  const { t } = useTranslation();
  const { activityId, appletId } = useParams();
  const navigate = useNavigate();

  const { fieldName = '' } = useCurrentActivity();

  const { trigger, getFieldState } = useFormContext();

  const navigateToActivities = () =>
    navigate(generatePath(page.builderAppletActivities, { appletId }));

  const handleBackBtnClick = async () => {
    await trigger();
    navigateToActivities();
  };

  const hasAppletErrors =
    !!getFieldState('activityFlows').error || !!getFieldState('displayName').error;
  const tabErrors = {
    hasAboutActivityErrors: !!getFieldState(`${fieldName}.name`).error,
    hasActivityItemsErrors: !!getFieldState(`${fieldName}.items`).error,
    hasActivitySubscalesErrors: !!getFieldState(`${fieldName}.subscaleSetting`).error,
    hasActivityReportsErrors: !!getFieldState(`${fieldName}.scoresAndReports`).error,
    hasActivityItemsFlowErrors: !!getFieldState(`${fieldName}.conditionalLogic`).error,
  };

  return (
    <StyledBuilderActivityBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={handleBackBtnClick}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activities')}
        <Badge variant="dot" invisible={!hasAppletErrors} color="error" />
      </StyledDirectoryUpButton>
      {activityId && (
        <LinkedTabs tabs={getActivityTabs({ activityId, appletId }, tabErrors)} isBuilder />
      )}
    </StyledBuilderActivityBody>
  );
};
