import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, StyledFlexTopCenter, StyledTooltipSvg, theme } from 'shared/styles';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components';

import { ScoreConditionProps } from './ScoreCondition.types';
import { ConditionContent } from '../../ConditionContent';
import { SectionScoreCommonFields } from '../../SectionScoreCommonFields';
import { ScoreConditionRowType } from '../../ConditionContent/ConditionContent.types';

export const ScoreCondition = ({ name }: ScoreConditionProps) => {
  const { t } = useTranslation();

  const { control } = useFormContext();

  return (
    <>
      <InputController
        control={control}
        name={`${name}.name`}
        label={t('scoreConditionName')}
        sx={{ mb: theme.spacing(2.4) }}
      />
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
