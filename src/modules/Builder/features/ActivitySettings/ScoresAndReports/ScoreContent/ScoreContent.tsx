import { Box, Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import {
  REACT_HOOK_FORM_KEY_NAME,
  SCORE_CONDS_COUNT_TO_ACTIVATE_STATIC,
} from 'modules/Builder/consts';
import {
  useCheckAndTriggerOnNameUniqueness,
  useCurrentActivity,
  useCustomFormContext,
} from 'modules/Builder/hooks';
import { SubscaleFormValue } from 'modules/Builder/types';
import { getObserverSelector } from 'modules/Builder/utils/getObserverSelector';
import { page } from 'resources';
import { DataTable } from 'shared/components';
import {
  InputController,
  RadioGroupController,
  SelectController,
  TransferListController,
} from 'shared/components/FormComponents';
import { Svg } from 'shared/components/Svg';
import { CalculationType, observerStyles } from 'shared/consts';
import { useStaticContent } from 'shared/hooks/useStaticContent';
import { ScoreConditionalLogic, ScoreReport, ScoreReportScoringType } from 'shared/state';
import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledLabelLarge,
  StyledObserverTarget,
  StyledTitleMedium,
  StyledTitleSmall,
  theme,
  variables,
} from 'shared/styles';
import { SelectEvent, isScoreReport } from 'shared/types';
import { SettingParam, getEntityKey } from 'shared/utils';

import { RemoveConditionalLogicPopup } from '../RemoveConditionalLogicPopup';
import { StyledButton } from '../ScoresAndReports.styles';
import { getTableScoreItems } from '../ScoresAndReports.utils';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { Title } from '../Title';
import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';
import { CopyId } from './CopyId';
import { ScoreCondition } from './ScoreCondition';
import { EMPTY_SCORE_RANGE_LABEL, calculationTypes } from './ScoreContent.const';
import { ScoreContentProps } from './ScoreContent.types';
import {
  getIsScoreIdVariable,
  getScoreConditionalDefaults,
  getScoreId,
  getScoreItemsColumns,
  getScoreRange,
  getScoreRangeLabel,
  getSelectedItemsColumns,
  updateMessagesWithVariable,
  updateScoreConditionIds,
  updateScoreConditionsPayload,
} from './ScoreContent.utils';
import { StaticScoreContent } from './StaticScoreContent';

export const ScoreContent = ({
  name,
  title,
  index,
  'data-testid': dataTestid,
  items,
  tableItems,
  scoreItems,
  isStaticActive,
}: ScoreContentProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId, activityId } = useParams();
  const { control, setValue, getValues } = useCustomFormContext();
  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const [isRemoveConditionalPopupVisible, setIsRemoveConditionalPopupVisible] = useState(false);
  const [removeConditionalIndex, setIsRemoveConditionalIndex] = useState(0);
  const { fieldName, activity } = useCurrentActivity();
  const targetSelector = getObserverSelector('report-score-content', index);
  const { isStatic } = useStaticContent({ targetSelector, isStaticActive });

  const reportsName = `${fieldName}.scoresAndReports.reports`;
  const scoreConditionalsName = `${name}.conditionalLogic`;
  const scoreIdField = `${name}.id`;
  const scoreNameField = `${name}.name`;
  const calculationTypeField = `${name}.calculationType`;
  const itemsScoreField = `${name}.itemsScore`;
  const scoringTypeField = `${name}.scoringType`;
  const subscaleNameField = `${name}.subscaleName`;

  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const subscalesResult: SubscaleFormValue[] = useWatch({ name: subscalesField, control });
  const subscales = useMemo(() => subscalesResult ?? [], [subscalesResult]);
  const score: ScoreReport = useWatch({ name, control });
  const {
    name: scoreName,
    id: scoreId,
    calculationType,
    itemsScore,
    scoringType,
    subscaleName,
  } = score || {};
  const [prevScoreName, setPrevScoreName] = useState(scoreName);
  const [prevCalculationType, setPrevCalculationType] = useState(calculationType);

  const selectedItemsPredicate = useCallback(
    (item: { id?: string; key?: string }) => itemsScore?.includes(getEntityKey(item, true)),
    [itemsScore],
  );
  const selectedItems = useMemo(
    () => scoreItems?.filter(selectedItemsPredicate),
    [scoreItems, selectedItemsPredicate],
  );

  const eligibleSubscales = useMemo(
    () =>
      subscales.filter(({ subscaleTableData, items }) => {
        const hasLookupTable = !!subscaleTableData && subscaleTableData.length > 0;

        // Subscales can contain only nested subscales, but they need at least one activity item
        // because that's what the report score is calculated from
        const hasNonSubscaleItems =
          scoreItems?.filter((item) => items.includes(getEntityKey(item, true)))?.length > 0;

        return hasLookupTable && hasNonSubscaleItems;
      }),
    [subscales, scoreItems],
  );
  const linkedSubscale = useMemo(
    () => eligibleSubscales.find(({ name }) => name === subscaleName),
    [eligibleSubscales, subscaleName],
  );

  const scoreRange = useMemo(
    () =>
      getScoreRange({
        items: selectedItems,
        calculationType,
        activity,
        lookupTable: scoringType === 'score' ? linkedSubscale?.subscaleTableData : null,
      }),
    [selectedItems, calculationType, activity, scoringType, linkedSubscale],
  );
  const scoreRangeLabel = useMemo(
    () => (selectedItems?.length ? getScoreRangeLabel(scoreRange) : EMPTY_SCORE_RANGE_LABEL),
    [selectedItems, scoreRange],
  );

  const {
    fields: scoreConditionals,
    append,
    remove,
  } = useFieldArray<
    Record<string, ScoreConditionalLogic[]>,
    string,
    typeof REACT_HOOK_FORM_KEY_NAME
  >({
    control,
    name: scoreConditionalsName,
    keyName: REACT_HOOK_FORM_KEY_NAME,
  });
  const conditionalsSize = scoreConditionals?.length ?? 0;

  useCheckAndTriggerOnNameUniqueness<ScoreReport>({
    currentPath: name,
    entitiesFieldPath: reportsName,
    checkIfShouldIncludeEntity: isScoreReport,
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

    setValue(scoreIdField, newScoreId);
    setPrevScoreName(scoreName);
    setPrevCalculationType(calculationType);
  };

  const onCancelChangeScoreId = () => {
    setIsChangeScoreIdPopupVisible(false);
    setValue(scoreNameField, prevScoreName);
    setValue(calculationTypeField, prevCalculationType);
  };

  const handleCalculationChange = useCallback(
    (event: { target: { value: string } }) => {
      const newCalculationType = event.target.value as CalculationType;
      setPrevCalculationType(score.calculationType);

      const oldScoreId = getScoreId(prevScoreName, prevCalculationType);
      const newScoreId = getScoreId(scoreName, newCalculationType);

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

      setValue(scoreIdField, newScoreId);
      setPrevCalculationType(newCalculationType);
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
        calculationType: newCalculationType,
        activity,
      });
    },
    [
      activity,
      getValues,
      prevCalculationType,
      prevScoreName,
      reportsName,
      score?.calculationType,
      score?.id,
      scoreConditionalsName,
      scoreName,
      selectedItems,
      setValue,
      scoreIdField,
    ],
  );

  const handleLinkedSubscaleChange = useCallback(
    (e: SelectEvent) => {
      const newSubscaleName = e.target.value;

      const newLinkedSubscale = eligibleSubscales.find(({ name }) => name === newSubscaleName);

      if (!newLinkedSubscale) return;

      setValue(subscaleNameField, newSubscaleName);

      if (scoringType === 'score') {
        setValue(calculationTypeField, newLinkedSubscale.scoring);

        const eligibleItems = newLinkedSubscale.items.filter(
          (item) => !!activity?.items.some((activityItem) => activityItem.id === item),
        );
        setValue(itemsScoreField, eligibleItems);

        if (`${calculationType}` !== `${newLinkedSubscale.scoring}`) {
          setValue(calculationTypeField, newLinkedSubscale.scoring);
          handleCalculationChange({ target: { value: newLinkedSubscale.scoring } });
        }
      }
    },
    [
      calculationTypeField,
      subscaleNameField,
      itemsScoreField,
      activity?.items,
      calculationType,
      handleCalculationChange,
      scoringType,
      setValue,
      eligibleSubscales,
    ],
  );

  const handleScoreTypeChange = useCallback(
    (e: SelectEvent) => {
      const scoringType = e.target.value as ScoreReportScoringType;
      setValue(scoringTypeField, scoringType);

      if (scoringType === 'score' && linkedSubscale) {
        if (`${calculationType}` !== `${linkedSubscale.scoring}`) {
          setValue(calculationTypeField, linkedSubscale.scoring);
          handleCalculationChange({ target: { value: linkedSubscale.scoring } });
        }

        setValue(itemsScoreField, linkedSubscale.items);
      }
    },
    [
      calculationTypeField,
      itemsScoreField,
      scoringTypeField,
      calculationType,
      handleCalculationChange,
      linkedSubscale,
      setValue,
    ],
  );

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

    setValue(scoreIdField, newScoreId);
    updateScoreConditionIds({
      setValue,
      conditionsName: scoreConditionalsName,
      scoreId: newScoreId,
      conditions: getValues(scoreConditionalsName),
    });
  };

  const onItemsToCalculateScoreChange = (chosenItems: string[] = []) => {
    const newSelectedItems = scoreItems?.filter(
      (item) => chosenItems?.includes(getEntityKey(item, true)),
    );
    updateScoreConditionsPayload({
      setValue,
      getValues,
      scoreConditionalsName,
      selectedItems: newSelectedItems,
      calculationType,
      activity,
    });
  };

  useEffect(() => {
    // Account for changes made to the linked subscale on the subscale configuration screen
    if (scoringType === 'score') {
      if (linkedSubscale) {
        if (`${calculationType}` !== `${linkedSubscale.scoring}`) {
          setValue(calculationTypeField, linkedSubscale.scoring);
          handleCalculationChange({ target: { value: linkedSubscale.scoring } });
        }

        setValue(itemsScoreField, linkedSubscale.items);
      } else {
        if (subscaleName) {
          setValue(subscaleNameField, '');
        }

        if (eligibleSubscales.length <= 0) {
          setValue(scoringTypeField, 'raw_score');
        }
      }
    } else {
      if (subscaleName === null || subscaleName === undefined) {
        // Account for scores that have been saved without a linked subscale
        // This will remove the MUI controlled field warnings
        setValue(subscaleNameField, '');
      }

      // Account for scores that have been saved without a scoring type
      if (!scoringType) {
        setValue(scoringTypeField, 'raw_score');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ItemsList = () => {
    if (scoringType === 'score' && linkedSubscale) {
      return (
        <Box sx={{ mb: theme.spacing(2.5) }}>
          <DataTable
            columns={getSelectedItemsColumns()}
            data={getTableScoreItems(scoreItems)?.filter(selectedItemsPredicate)}
            noDataPlaceholder={t('noSelectedItemsYet')}
            data-testid={`${dataTestid}-selected`}
          />
        </Box>
      );
    }

    return (
      <TransferListController
        name={itemsScoreField}
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
    );
  };

  return (
    <StyledFlexColumn data-testid={dataTestid} sx={{ position: 'relative' }}>
      <StyledObserverTarget className={targetSelector} sx={observerStyles} />
      {isStatic ? (
        <StaticScoreContent scoreConditionals={scoreConditionals} />
      ) : (
        <>
          <StyledFlexTopStart sx={{ mt: theme.spacing(1.6) }}>
            <Box sx={{ mr: theme.spacing(2.4), width: '50%' }}>
              <InputController
                control={control}
                key={scoreNameField}
                name={scoreNameField}
                label={t('scoreName')}
                onBlur={handleNameBlur}
                sx={{ mb: theme.spacing(4.8) }}
                data-testid={`${dataTestid}-name`}
                withDebounce
              />
              <SelectController
                name={calculationTypeField}
                sx={{ mb: theme.spacing(4.8) }}
                control={control}
                options={calculationTypes}
                label={t('scoreCalculationType')}
                fullWidth
                data-testid={`${dataTestid}-calculation-type`}
                customChange={handleCalculationChange}
                disabled={scoringType === 'score'}
                variant={'outlined'}
              />
            </Box>
            <Box sx={{ ml: theme.spacing(2.4), width: '50%' }}>
              <CopyId title={t('scoreId')} value={scoreId} showCopy data-testid={dataTestid} />
              <StyledTitleSmall sx={{ m: theme.spacing(2.4, 0, 1.2, 0) }}>
                {t('rangeOfScores')}
              </StyledTitleSmall>
              <StyledBodyLarge
                sx={{ mb: theme.spacing(2.4) }}
                data-testid={`${dataTestid}-score-range`}
              >
                {scoreRangeLabel}
              </StyledBodyLarge>
            </Box>
          </StyledFlexTopStart>
          {eligibleSubscales.length > 0 && (
            <StyledFlexColumn sx={{ mt: theme.spacing(1.6) }}>
              <StyledTitleMedium>{t('scoreContent.whichScoreType')}</StyledTitleMedium>
              <RadioGroupController
                name={scoringTypeField}
                control={control}
                onChange={handleScoreTypeChange}
                options={[
                  {
                    value: 'score',
                    label: t('scoreContent.scoreRadioBtn.label'),
                    tooltipText: t('scoreContent.scoreRadioBtn.tooltip'),
                  },
                  {
                    value: 'raw_score',
                    label: t('scoreContent.rawScoreRadioBtn.label'),
                    tooltipText: t('scoreContent.rawScoreRadioBtn.tooltip'),
                  },
                ]}
                defaultValue={'raw_score'}
                data-testid={`${dataTestid}-score-type-toggle`}
              />
              {scoringType === 'score' && (
                <StyledFlexTopCenter sx={{ mt: 0.8, gap: 2.4 }}>
                  <SelectController
                    name={subscaleNameField}
                    sx={{ width: '50%', pr: theme.spacing(2.4) }}
                    control={control}
                    options={eligibleSubscales.map(({ name }) => ({
                      value: name,
                      labelKey: name,
                    }))}
                    label={t('scoreContent.linkedSubscaleField.label')}
                    InputLabelProps={{ shrink: true }}
                    placeholder={t('scoreContent.linkedSubscaleField.placeholder')}
                    fullWidth
                    data-testid={`${dataTestid}-linked-subscale`}
                    customChange={handleLinkedSubscaleChange}
                    variant="outlined"
                  />
                  {subscaleName && (
                    <Button
                      variant="outlined"
                      sx={{
                        background: 'transparent',
                        paddingX: theme.spacing(2.4),
                        borderColor: variables.palette.outline_variant2,
                      }}
                      data-testid={`${dataTestid}-view-subscales-configuration`}
                      onClick={() => {
                        // We may not be able to navigate to a specific subscale without modifying that
                        // screen. So let's just go to the subscales screen for now.
                        navigate(
                          generatePath(page.builderAppletActivitySettingsItem, {
                            appletId,
                            activityId,
                            setting: SettingParam.SubscalesConfiguration,
                          }),
                        );
                      }}
                    >
                      <StyledLabelLarge color={variables.palette.primary}>
                        {t('scoreContent.viewSubscaleConfiguration')}
                      </StyledLabelLarge>
                    </Button>
                  )}
                </StyledFlexTopCenter>
              )}
            </StyledFlexColumn>
          )}
          <StyledTitleMedium sx={{ mb: theme.spacing(1.2), mt: theme.spacing(2.4) }}>
            {t('scoreItems')}
          </StyledTitleMedium>
          <ItemsList />
          <SectionScoreCommonFields
            name={name}
            sectionId={`score-${index}`}
            data-testid={dataTestid}
            items={items}
          />
          {!!conditionalsSize && (
            <>
              <StyledTitleMedium sx={{ m: theme.spacing(2.4, 0) }}>
                {t('scoreConditions')}
              </StyledTitleMedium>
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
                      scoreConditionalsName,
                      score,
                      scoreKey: `score-condition-${index}-${key}`,
                      items,
                      scoreRange,
                      'data-testid': conditionalDataTestid,
                      isStaticActive: conditionalsSize > SCORE_CONDS_COUNT_TO_ACTIVATE_STATIC,
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
            data-testid={`${dataTestid}-add-score-conditional`}
          >
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
        </>
      )}
    </StyledFlexColumn>
  );
};
