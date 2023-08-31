import { useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Tooltip } from 'shared/components';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import {
  theme,
  variables,
  StyledBodyLarge,
  StyledFlexColumn,
  StyledTitleMedium,
} from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'shared/consts';
import { BuilderContainer } from 'shared/features';
import { AppletFormValues } from 'modules/Builder/types';
import { useActivityFlowsRedirection } from 'modules/Builder/hooks';

import { getActivityFlowIndex } from '../ActivityFlowBuilder/ActivityFlowBuilder.utils';
import { StyledWrapper, StyledSvg } from './ActivityFlowAbout.styles';

export const ActivityFlowAbout = () => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();
  const { activityFlowId } = useParams();

  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');
  const activityFlowIndex = getActivityFlowIndex(activityFlows, activityFlowId || '');

  const dataTestid = 'builder-activity-flows-about';
  const commonProps = {
    fullWidth: true,
    control,
  };

  useBreadcrumbs();
  useActivityFlowsRedirection();

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
            multiline
            rows={4}
            data-testid={`${dataTestid}-description`}
          />
        </Box>
        <StyledTitleMedium
          color={variables.palette.on_surface_variant}
          sx={{ marginBottom: theme.spacing(1.4) }}
        >
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
