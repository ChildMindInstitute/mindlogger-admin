import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import {
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledTitleSmall,
  StyledTooltipSvg,
  theme,
} from 'shared/styles';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components';

import { ScoreConditionProps } from './ScoreCondition.types';
import { ConditionContent } from '../../ConditionContent';
import { SectionScoreCommonFields } from '../../SectionScoreCommonFields';
import { ScoreConditionRowType } from '../../ConditionContent/ConditionContent.types';
import { getScoreConditionId } from './ScoreCondition.utils';

export const ScoreCondition = ({ name, scoreId }: ScoreConditionProps) => {
  const { t } = useTranslation();

  const { control, setValue, watch } = useFormContext();
  const conditionName = watch(`${name}.name`);
  const conditionId = watch(`${name}.id`);

  const handleConditionNameBlur = () => {
    setValue(`${name}.id`, getScoreConditionId(conditionName, scoreId));
  };

  return (
    <>
      <StyledFlexTopCenter sx={{ mb: theme.spacing(2.4) }}>
        <InputController
          control={control}
          name={`${name}.name`}
          label={t('scoreConditionName')}
          onBlur={handleConditionNameBlur}
        />
        <Box sx={{ ml: theme.spacing(4.8), width: '50%' }}>
          <StyledTitleSmall sx={{ mb: theme.spacing(1.2) }}>
            {t('scoreConditionId')}
          </StyledTitleSmall>
          <StyledBodyLarge>{conditionId}</StyledBodyLarge>
        </Box>
      </StyledFlexTopCenter>
      <ConditionContent name={name} type={ScoreConditionRowType.Score} />
      <CheckboxController
        control={control}
        name={`${name}.flagScoreName`}
        label={
          <StyledFlexTopCenter>
            <StyledBodyLarge>{t('flagScore')}</StyledBodyLarge>
            <Tooltip tooltipTitle={t('flagScoreTooltip')}>
              <StyledFlexTopCenter>
                <StyledTooltipSvg id="more-info-outlined" width="20" height="20" />
              </StyledFlexTopCenter>
            </Tooltip>
          </StyledFlexTopCenter>
        }
      />
      <SectionScoreCommonFields name={name} />
    </>
  );
};
