import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import {
  StyledBodyLarge,
  StyledFlexTopCenter,
  StyledTooltipSvg,
  theme,
  variables,
} from 'shared/styles';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components/Tooltip';
import { ConditionRowType } from 'modules/Builder/types';

import { ScoreConditionProps } from './ScoreCondition.types';
import { ConditionContent } from '../../ConditionContent';
import { SectionScoreCommonFields } from '../../SectionScoreCommonFields';
import { getScoreConditionId } from './ScoreCondition.utils';
import { CopyId } from '../CopyId';
import { StyledLabel } from './ScoreCondition.styles';

export const ScoreCondition = ({
  name,
  scoreId,
  scoreKey,
  'data-testid': dataTestid,
}: ScoreConditionProps) => {
  const { t } = useTranslation();

  const { control, setValue, watch } = useFormContext();
  const conditionName = watch(`${name}.name`);
  const conditionId = watch(`${name}.id`);

  const handleConditionNameBlur = () => {
    setValue(`${name}.id`, getScoreConditionId(scoreId, conditionName));
  };

  return (
    <>
      <StyledFlexTopCenter sx={{ m: theme.spacing(1.2, 0, 2.4, 0) }}>
        <InputController
          control={control}
          key={`${name}.name`}
          name={`${name}.name`}
          label={t('scoreConditionName')}
          onBlur={handleConditionNameBlur}
          data-testid={`${dataTestid}-name`}
        />
        <Box sx={{ ml: theme.spacing(4.8), width: '50%' }}>
          <CopyId
            title={t('scoreConditionId')}
            value={conditionId}
            showCopy={conditionName}
            data-testid={`${dataTestid}-copy`}
          />
        </Box>
      </StyledFlexTopCenter>
      <ConditionContent
        name={name}
        type={ConditionRowType.Score}
        scoreId={scoreId}
        data-testid={dataTestid}
      />
      <CheckboxController
        control={control}
        name={`${name}.flagScore`}
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
        data-testid={`${dataTestid}-flag-score`}
      />
      <SectionScoreCommonFields
        tableHeadBackground={variables.palette.surface3}
        name={name}
        sectionId={scoreKey}
        data-testid={dataTestid}
      />
    </>
  );
};
