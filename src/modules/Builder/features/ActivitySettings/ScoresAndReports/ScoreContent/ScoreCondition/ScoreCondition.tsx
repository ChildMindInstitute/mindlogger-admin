import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { StyledBodyLarge, StyledFlexTopCenter, StyledTooltipSvg, theme } from 'shared/styles';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components';
import { ConditionRowType } from 'modules/Builder/types';

import { ScoreConditionProps } from './ScoreCondition.types';
import { ConditionContent } from '../../ConditionContent';
import { SectionScoreCommonFields } from '../../SectionScoreCommonFields';
import { getScoreConditionId } from './ScoreCondition.utils';
import { CopyId } from '../CopyId';
import { StyledLabel } from './ScoreCondition.styles';

export const ScoreCondition = ({ name, scoreId, scoreName }: ScoreConditionProps) => {
  const { t } = useTranslation();

  const { control, setValue, watch } = useFormContext();
  const conditionName = watch(`${name}.name`);
  const conditionId = watch(`${name}.id`);

  const handleConditionNameBlur = () => {
    setValue(`${name}.id`, getScoreConditionId(scoreId, conditionName));
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
          <CopyId title={t('scoreConditionId')} value={conditionId} showCopy={conditionName} />
        </Box>
      </StyledFlexTopCenter>
      <ConditionContent
        name={name}
        type={ConditionRowType.Score}
        scoreId={scoreId}
        scoreName={scoreName}
      />
      <CheckboxController
        control={control}
        name={`${name}.flagScoreName`}
        label={
          <StyledLabel>
            <StyledBodyLarge>{t('flagScore')}</StyledBodyLarge>
            <Tooltip tooltipTitle={t('flagScoreTooltip')}>
              <StyledFlexTopCenter>
                <StyledTooltipSvg id="more-info-outlined" width="20" height="20" />
              </StyledFlexTopCenter>
            </Tooltip>
          </StyledLabel>
        }
      />
      <SectionScoreCommonFields name={name} />
    </>
  );
};
