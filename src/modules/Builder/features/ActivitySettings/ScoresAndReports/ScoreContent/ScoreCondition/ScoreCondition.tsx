import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useCheckAndTriggerOnNameUniqueness, useCustomFormContext } from 'modules/Builder/hooks';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledObserverTarget,
  StyledTooltipSvg,
  theme,
  variables,
} from 'shared/styles';
import { CheckboxController, InputController } from 'shared/components/FormComponents';
import { Tooltip } from 'shared/components/Tooltip';
import { ConditionRowType } from 'modules/Builder/types';
import { useStaticContent } from 'shared/hooks/useStaticContent';
import { observerStyles } from 'modules/Builder/consts';

import { ScoreConditionProps } from './ScoreCondition.types';
import { ConditionContent } from '../../ConditionContent';
import { SectionScoreCommonFields } from '../../SectionScoreCommonFields';
import { getScoreConditionId } from './ScoreCondition.utils';
import { CopyId } from '../CopyId';
import { StyledLabel } from './ScoreCondition.styles';
import { getIsScoreIdVariable, updateMessagesWithVariable } from '../ScoreContent.utils';
import { ChangeScoreConditionIdPopup } from './ChangeScoreConditionIdPopup';
import { StaticScoreCondition } from './StaticScoreCondition';

export const ScoreCondition = ({
  name,
  reportsName,
  scoreConditionalsName,
  score,
  scoreKey,
  items,
  scoreRange,
  'data-testid': dataTestid,
  isStaticActive,
}: ScoreConditionProps) => {
  const { t } = useTranslation();
  const { control, setValue, watch, getValues } = useCustomFormContext();
  const conditionName = watch(`${name}.name`);
  const conditionId = watch(`${name}.id`);
  const targetSelector = `report-${scoreKey}`;
  const { isStatic } = useStaticContent({ targetSelector, isStaticActive });

  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const [prevScoreConditionName, setPrevScoreConditionName] = useState(conditionName);

  useCheckAndTriggerOnNameUniqueness({
    currentPath: name,
    entitiesFieldPath: scoreConditionalsName,
  });

  const handleConditionNameBlur = () => {
    if (conditionName === prevScoreConditionName) return;

    const oldScoreConditionId = getScoreConditionId(score?.id, prevScoreConditionName);
    const newScoreConditionId = getScoreConditionId(score?.id, conditionName);

    if (oldScoreConditionId !== newScoreConditionId && !!prevScoreConditionName) {
      const isVariable = getIsScoreIdVariable({
        id: conditionId,
        reports: getValues(reportsName),
        isScore: false,
      });

      if (isVariable) {
        setIsChangeScoreIdPopupVisible(true);

        return;
      }
    }

    setPrevScoreConditionName(conditionName);
    setValue(`${name}.id`, getScoreConditionId(score?.id, conditionName));
  };

  const handleCancelChangeConditionName = () => {
    setIsChangeScoreIdPopupVisible(false);
    setValue(`${name}.name`, prevScoreConditionName);
  };

  const handleChangeConditionName = () => {
    const newConditionScoreId = getScoreConditionId(score.id, conditionName);
    updateMessagesWithVariable({
      setValue,
      reportsName,
      reports: getValues(reportsName),
      oldScoreId: conditionId,
      newScoreId: newConditionScoreId,
      isScore: false,
    });

    setValue(`${name}.id`, newConditionScoreId);
    setPrevScoreConditionName(conditionName);
  };

  return (
    <StyledFlexColumn sx={{ position: 'relative' }}>
      <StyledObserverTarget className={targetSelector} sx={observerStyles} />
      {isStatic ? (
        <StaticScoreCondition />
      ) : (
        <>
          <StyledFlexTopCenter sx={{ m: theme.spacing(1.2, 0, 2.4, 0) }}>
            <InputController
              control={control}
              key={`${name}.name`}
              name={`${name}.name`}
              label={t('scoreConditionName')}
              onBlur={handleConditionNameBlur}
              data-testid={`${dataTestid}-name`}
              withDebounce
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
            score={score}
            scoreRange={scoreRange}
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
            items={items}
          />
          {isChangeScoreIdPopupVisible && (
            <ChangeScoreConditionIdPopup
              onClose={handleCancelChangeConditionName}
              onChange={handleChangeConditionName}
              data-testid={`${dataTestid}-change-score-condition-id-popup`}
            />
          )}
        </>
      )}
    </StyledFlexColumn>
  );
};
