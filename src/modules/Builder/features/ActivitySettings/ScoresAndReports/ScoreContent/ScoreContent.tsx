import { useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopStart,
  StyledTitleMedium,
  StyledTitleSmall,
  theme,
} from 'shared/styles';
import { InputController, SelectController, TransferListController } from 'shared/components/FormComponents';
import { Svg } from 'shared/components/Svg';
import { ScoreConditionalLogic } from 'shared/state';
import { CalculationType } from 'shared/consts';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { getEntityKey } from 'shared/utils';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';
import { SelectEvent } from 'shared/types';

import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { CopyId } from './CopyId';
import { RemoveConditionalLogicPopup } from '../RemoveConditionalLogicPopup';
import { Title } from '../Title';
import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';
import { ScoreCondition } from './ScoreCondition';
import { EMPTY_SCORE_RANGE_LABEL, calculationTypes } from './ScoreContent.const';
import {
  getScoreItemsColumns,
  getSelectedItemsColumns,
  getScoreConditionalDefaults,
  getIsScoreIdVariable,
  getScoreId,
  getScoreRange,
  getScoreRangeLabel,
  updateMessagesWithVariable,
  updateScoreConditionIds,
  updateScoreConditionsPayload,
} from './ScoreContent.utils';
import { ScoreContentProps } from './ScoreContent.types';

export const ScoreContent = ({
  name,
  title,
  index,
  'data-testid': dataTestid,
  items,
  tableItems,
  scoreItems,
}: ScoreContentProps) => {
  const { t } = useTranslation('app');
  const { control, setValue, getValues } = useCustomFormContext();
  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const [isRemoveConditionalPopupVisible, setIsRemoveConditionalPopupVisible] = useState(false);
  const [removeConditionalIndex, setIsRemoveConditionalIndex] = useState(0);
  const { fieldName, activity } = useCurrentActivity();

  const reportsName = `${fieldName}.scoresAndReports.reports`;
  const scoreConditionalsName = `${name}.conditionalLogic`;

  const score = useWatch({ name });
  const { name: scoreName, id: scoreId, calculationType, itemsScore } = score || {};
  const [prevScoreName, setPrevScoreName] = useState(scoreName);
  const [prevCalculationType, setPrevCalculationType] = useState(calculationType);
  const selectedItems = scoreItems?.filter(item => itemsScore?.includes(getEntityKey(item, true)));
  const scoreRange = getScoreRange({ items: selectedItems, calculationType, activity });
  const scoreRangeLabel = selectedItems?.length ? getScoreRangeLabel(scoreRange) : EMPTY_SCORE_RANGE_LABEL;

  const {
    fields: scoreConditionals,
    append,
    remove,
  } = useFieldArray<Record<string, ScoreConditionalLogic[]>, string, typeof REACT_HOOK_FORM_KEY_NAME>({
    control,
    name: scoreConditionalsName,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });

  const removeScoreConditional = (index: number) => {
    setIsRemoveConditionalPopupVisible(true);
    setIsRemoveConditionalIndex(index);
  };

  const handleAddScoreConditional = () => {
    append(getScoreConditionalDefaults(scoreId, score?.key));
  };

  const onChangeScoreId = () => {
    const newScoreId = getScoreId(scoreName, calculationType);
    updateMessagesWithVariable({
      setValue,
      reportsName,
      reports: getValues(reportsName),
      oldScoreId: score.id,
      newScoreId,
      isScore: true,
    });
    updateScoreConditionIds({
      setValue,
      conditionsName: scoreConditionalsName,
      conditions: getValues(scoreConditionalsName),
      scoreId: newScoreId,
    });

    setValue(`${name}.id`, newScoreId);
    setPrevScoreName(scoreName);
    setPrevCalculationType(calculationType);
  };

  const onCancelChangeScoreId = () => {
    setIsChangeScoreIdPopupVisible(false);
    setValue(`${name}.name`, prevScoreName);
    setValue(`${name}.calculationType`, prevCalculationType);
  };

  const handleCalculationChange = (event: SelectEvent) => {
    const calculationType = event.target.value as CalculationType;
    setPrevCalculationType(score.calculationType);

    const oldScoreId = getScoreId(prevScoreName, prevCalculationType);
    const newScoreId = getScoreId(scoreName, calculationType);

    if (oldScoreId !== newScoreId) {
      const isVariable = getIsScoreIdVariable({
        id: score.id,
        reports: getValues(reportsName),
        isScore: true,
      });

      if (isVariable) {
        setIsChangeScoreIdPopupVisible(true);

        return;
      }
    }

    setValue(`${name}.id`, newScoreId);
    setPrevCalculationType(calculationType);
    updateScoreConditionIds({
      setValue,
      conditionsName: scoreConditionalsName,
      scoreId: newScoreId,
      conditions: getValues(scoreConditionalsName),
    });
    updateScoreConditionsPayload({
      setValue,
      getValues,
      scoreConditionalsName,
      selectedItems,
      calculationType,
      activity,
    });
  };

  const handleNameBlur = () => {
    if (scoreName === prevScoreName) return;

    const oldScoreId = getScoreId(prevScoreName, calculationType);
    const newScoreId = getScoreId(scoreName, calculationType);

    if (oldScoreId !== newScoreId) {
      const isVariable = getIsScoreIdVariable({
        id: score.id,
        reports: getValues(reportsName),
        isScore: true,
      });

      if (isVariable) {
        setIsChangeScoreIdPopupVisible(true);

        return;
      }
    }

    setPrevScoreName(scoreName);

    setValue(`${name}.id`, newScoreId);
    updateScoreConditionIds({
      setValue,
      conditionsName: scoreConditionalsName,
      scoreId: newScoreId,
      conditions: getValues(scoreConditionalsName),
    });
  };

  const onItemsToCalculateScoreChange = (chosenItems: string[] = []) => {
    const newSelectedItems = scoreItems?.filter(item => chosenItems?.includes(getEntityKey(item, true)));
    updateScoreConditionsPayload({
      setValue,
      getValues,
      scoreConditionalsName,
      selectedItems: newSelectedItems,
      calculationType,
      activity,
    });
  };

  return (
    <StyledFlexColumn data-testid={dataTestid}>
      <StyledFlexTopStart sx={{ mt: theme.spacing(1.6) }}>
        <Box sx={{ mr: theme.spacing(2.4), width: '50%' }}>
          <InputController
            control={control}
            key={`${name}.name`}
            name={`${name}.name`}
            label={t('scoreName')}
            onBlur={handleNameBlur}
            sx={{ mb: theme.spacing(4.8) }}
            data-testid={`${dataTestid}-name`}
          />
          <SelectController
            name={`${name}.calculationType`}
            sx={{ mb: theme.spacing(4.8) }}
            control={control}
            options={calculationTypes}
            label={t('scoreCalculationType')}
            fullWidth
            data-testid={`${dataTestid}-calculation-type`}
            customChange={handleCalculationChange}
          />
        </Box>
        <Box sx={{ ml: theme.spacing(2.4), width: '50%' }}>
          <CopyId title={t('scoreId')} value={scoreId} showCopy data-testid={dataTestid} />
          <StyledTitleSmall sx={{ m: theme.spacing(2.4, 0, 1.2, 0) }}>{t('rangeOfScores')}</StyledTitleSmall>
          <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }} data-testid={`${dataTestid}-score-range`}>
            {scoreRangeLabel}
          </StyledBodyLarge>
        </Box>
      </StyledFlexTopStart>
      <StyledTitleMedium sx={{ mb: theme.spacing(1.2) }}>{t('scoreItems')}</StyledTitleMedium>
      <TransferListController
        name={`${name}.itemsScore`}
        items={tableItems}
        columns={getScoreItemsColumns()}
        selectedItemsColumns={getSelectedItemsColumns()}
        hasSelectedSection
        searchKey="label"
        hasSearch
        sxProps={{ mb: theme.spacing(2.5) }}
        tooltipByDefault
        onChangeSelectedCallback={onItemsToCalculateScoreChange}
        data-testid={`${dataTestid}-items-score`}
      />
      <SectionScoreCommonFields name={name} sectionId={`score-${index}`} data-testid={dataTestid} items={items} />
      {!!scoreConditionals?.length && (
        <>
          <StyledTitleMedium sx={{ m: theme.spacing(2.4, 0) }}>{t('scoreConditions')}</StyledTitleMedium>
          {scoreConditionals?.map((conditional: ScoreConditionalLogic, key: number) => {
            const conditionalName = `${scoreConditionalsName}.${key}`;
            const title = t('scoreConditional', {
              index: key + 1,
            });
            const headerTitle = <Title title={title} reportFieldName={conditionalName} />;
            const conditionalDataTestid = `${dataTestid}-conditional-${key}`;

            return (
              <ToggleItemContainer
                key={`data-score-conditional-${getEntityKey(conditional) || key}-${key}`}
                HeaderContent={SectionScoreHeader}
                Content={ScoreCondition}
                contentProps={{
                  name: conditionalName,
                  reportsName,
                  score,
                  scoreKey: `score-condition-${index}-${key}`,
                  items,
                  scoreRange,
                  'data-testid': conditionalDataTestid,
                }}
                headerContentProps={{
                  onRemove: () => removeScoreConditional(key),
                  title: headerTitle,
                  name: conditionalName,
                  'data-testid': conditionalDataTestid,
                }}
                uiType={ToggleContainerUiType.Score}
                data-testid={conditionalDataTestid}
              />
            );
          })}
        </>
      )}
      <StyledButton
        startIcon={<Svg id="add" width="20" height="20" />}
        onClick={handleAddScoreConditional}
        data-testid={`${dataTestid}-add-score-conditional`}>
        {t('addScoreCondition')}
      </StyledButton>
      {isChangeScoreIdPopupVisible && (
        <ChangeScoreIdPopup
          onClose={onCancelChangeScoreId}
          onChange={onChangeScoreId}
          data-testid={`${dataTestid}-change-score-id-popup`}
        />
      )}
      {isRemoveConditionalPopupVisible && (
        <RemoveConditionalLogicPopup
          onClose={() => setIsRemoveConditionalPopupVisible(false)}
          onRemove={() => remove(removeConditionalIndex)}
          name={title}
          reportFieldName={name}
          data-testid={`${dataTestid}-remove-conditional-logic-popup`}
        />
      )}
    </StyledFlexColumn>
  );
};
