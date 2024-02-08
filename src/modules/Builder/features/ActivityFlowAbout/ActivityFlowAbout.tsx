import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { Tooltip } from 'shared/components/Tooltip';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { theme, variables, StyledBodyLarge, StyledFlexColumn, StyledTitleMedium } from 'shared/styles';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH, TEXTAREA_ROWS_COUNT_SM } from 'shared/consts';
import { BuilderContainer } from 'shared/features';
import { AppletFormValues } from 'modules/Builder/types';
import { useRedirectIfNoMatchedActivityFlow } from 'modules/Builder/hooks';

import { getActivityFlowIndex } from '../ActivityFlowBuilder/ActivityFlowBuilder.utils';
import { StyledWrapper, StyledSvg } from './ActivityFlowAbout.styles';

export const ActivityFlowAbout = () => {
  const { t } = useTranslation();
  const { control, watch } = useCustomFormContext();
  const { activityFlowId } = useParams();

  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');
  const activityFlowIndex = getActivityFlowIndex(activityFlows, activityFlowId || '');

  const dataTestid = 'builder-activity-flows-about';
  const commonProps = {
    fullWidth: true,
    control,
  };

  useRedirectIfNoMatchedActivityFlow();

  return (
    <BuilderContainer title={t('aboutActivityFlow')}>
      <StyledWrapper>
        <Box sx={{ mb: theme.spacing(4.4) }}>
          <InputController
            {...commonProps}
            key={`activityFlows.${activityFlowIndex}.name`}
            name={`activityFlows.${activityFlowIndex}.name`}
            label={t('activityFlowName')}
            maxLength={MAX_NAME_LENGTH}
            restrictExceededValueLength
            data-testid={`${dataTestid}-name`}
          />
        </Box>
        <Box sx={{ mb: theme.spacing(4.4) }}>
          <InputController
            {...commonProps}
            key={`activityFlows.${activityFlowIndex}.description`}
            name={`activityFlows.${activityFlowIndex}.description`}
            label={t('activityFlowDescription')}
            maxLength={MAX_DESCRIPTION_LENGTH}
            restrictExceededValueLength
            multiline
            rows={TEXTAREA_ROWS_COUNT_SM}
            data-testid={`${dataTestid}-description`}
          />
        </Box>
        <StyledTitleMedium color={variables.palette.on_surface_variant} sx={{ marginBottom: theme.spacing(1.4) }}>
          {t('additionalSettings')}
        </StyledTitleMedium>
        <StyledFlexColumn>
          <CheckboxController
            control={control}
            key={`activityFlows.${activityFlowIndex}.isSingleReport`}
            name={`activityFlows.${activityFlowIndex}.isSingleReport`}
            label={<StyledBodyLarge>{t('combineReportsIntoSingleFile')}</StyledBodyLarge>}
            data-testid={`${dataTestid}-single-report`}
          />
          <CheckboxController
            control={control}
            key={`activityFlows.${activityFlowIndex}.hideBadge`}
            name={`activityFlows.${activityFlowIndex}.hideBadge`}
            label={
              <StyledBodyLarge sx={{ position: 'relative' }}>
                {t('hideBadge')}
                <Tooltip tooltipTitle={t('hideBadgeTooltip')}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledBodyLarge>
            }
            data-testid={`${dataTestid}-hide-badge`}
          />
        </StyledFlexColumn>
      </StyledWrapper>
    </BuilderContainer>
  );
};
