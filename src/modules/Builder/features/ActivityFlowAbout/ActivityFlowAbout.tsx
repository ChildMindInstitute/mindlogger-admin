import { useEffect } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg, Tooltip } from 'shared/components';
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
import { ActivityFlow as ActivityFlowType } from 'shared/state';
import { page } from 'resources';

import { StyledWrapper, StyledSvg } from './ActivityFlowAbout.styles';

export const ActivityFlowAbout = () => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext();
  const navigate = useNavigate();
  const { appletId, activityFlowId } = useParams();

  const activityFlows: (Omit<ActivityFlowType, 'description'> & { description: string })[] =
    watch('activityFlows');
  const index = activityFlows.findIndex((flow) => flow.id === activityFlowId);
  const commonProps = {
    fullWidth: true,
    control,
  };

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutActivityFlow'),
    },
  ]);

  useEffect(() => {
    if (index === -1) {
      navigate(
        generatePath(page.builderAppletActivityFlow, {
          appletId,
        }),
      );
    }
  }, [index]);

  return (
    <BuilderContainer title={t('aboutActivityFlow')}>
      <StyledWrapper>
        <Box sx={{ mb: theme.spacing(4.4) }}>
          <InputController
            {...commonProps}
            name={`activityFlows.${index}.name`}
            label={t('activityFlowName')}
            maxLength={MAX_NAME_LENGTH}
          />
        </Box>
        <Box sx={{ mb: theme.spacing(4.4) }}>
          <InputController
            {...commonProps}
            name={`activityFlows.${index}.description`}
            label={t('activityFlowDescription')}
            maxLength={MAX_DESCRIPTION_LENGTH}
            multiline
            rows={4}
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
            name={`activityFlows.${index}.isSingleReport`}
            label={<StyledBodyLarge>{t('combineReportsIntoSingleFile')}</StyledBodyLarge>}
          />
          <CheckboxController
            control={control}
            name={`activityFlows.${index}.hideBadge`}
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
          />
        </StyledFlexColumn>
      </StyledWrapper>
    </BuilderContainer>
  );
};
