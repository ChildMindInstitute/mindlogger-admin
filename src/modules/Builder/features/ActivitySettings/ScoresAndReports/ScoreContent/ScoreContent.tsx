import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopStart,
  StyledTitleMedium,
  StyledTitleSmall,
  theme,
} from 'shared/styles';
import {
  InputController,
  SelectController,
  TransferListController,
} from 'shared/components/FormComponents';
import { Svg } from 'shared/components';
import { Item, ScoreConditionalLogic } from 'shared/state';
import { CalculationType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { getEntityKey } from 'shared/utils';

import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { CopyId } from './CopyId';
import { RemoveConditionalLogicPopup } from '../RemoveConditionalLogicPopup';
import { Title } from '../Title';
import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';
import { ScoreCondition } from './ScoreCondition';
import { calculationTypes, scoreItemsColumns, selectedItemsColumns } from './ScoreContent.const';
import {
  getDefaultConditionalValue,
  getIsScoreIdVariable,
  getScoreId,
  getScoreRange,
  getScoreRangeLabel,
  getTableScoreItems,
  updateMessagesWithVariable,
} from './ScoreContent.utils';
import { ScoreContentProps } from './ScoreContent.types';

export const ScoreContent = ({
  name,
  title,
  index,
  'data-testid': dataTestid,
}: ScoreContentProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const { activity } = useCurrentActivity();
  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const [isRemoveConditionalPopupVisible, setIsRemoveConditionalPopupVisible] = useState(false);
  const [removeConditionalIndex, setIsRemoveConditionalIndex] = useState(0);

  const scoreConditionalsName = `${name}.conditionalLogic`;

  const scoreConditionals = watch(scoreConditionalsName);
  const score = watch(name);
  const scoreName = watch(`${name}.name`);
  const scoreId = watch(`${name}.id`);
  const calculationType: CalculationType = watch(`${name}.calculationType`);
  const itemsScore: string[] = watch(`${name}.itemsScore`);
  const items: Item[] = activity?.items.filter(checkOnItemTypeAndScore);
  const tableItems = getTableScoreItems(items);
  const [scoreRangeLabel, setScoreRangeLabel] = useState<string>('-');
  const [prevScoreName, setPrevScoreName] = useState(scoreName);

  const { append, remove } = useFieldArray({
    control,
    name: scoreConditionalsName,
  });

  const removeScoreConditional = (index: number) => {
    setIsRemoveConditionalPopupVisible(true);
    setIsRemoveConditionalIndex(index);
  };

  const handleAddScoreConditional = () => {
    append(getDefaultConditionalValue(scoreId));
  };

  useEffect(() => {
    const selectedItems = items?.filter((item) => itemsScore.includes(item.name));
    if (selectedItems?.length) {
      const { minScore, maxScore } = getScoreRange(selectedItems, calculationType);
      setScoreRangeLabel(getScoreRangeLabel(minScore as number, maxScore as number));
    } else {
      setScoreRangeLabel('-');
    }
  }, [itemsScore, calculationType]);

  const onChangeScoreId = () => {
    const updatedScoreId = getScoreId(scoreName, calculationType);
    updateMessagesWithVariable(setValue, name, score, updatedScoreId);

    setValue(`${name}.id`, updatedScoreId);
    setPrevScoreName(scoreName);
  };

  const onCancelChangeScoreId = () => {
    setIsChangeScoreIdPopupVisible(false);
    setValue(`${name}.name`, prevScoreName);
  };

  useEffect(() => {
    setValue(`${name}.id`, getScoreId(scoreName, calculationType));
  }, [calculationType]);

  const handleNameBlur = () => {
    const isVariable = getIsScoreIdVariable(score);

    if (isVariable) {
      setIsChangeScoreIdPopupVisible(true);

      return;
    }

    setPrevScoreName(scoreName);
    setValue(`${name}.id`, getScoreId(scoreName, calculationType));
  };

  return (
    <StyledFlexColumn>
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
          />
        </Box>
        <Box sx={{ ml: theme.spacing(2.4), width: '50%' }}>
          <CopyId
            title={t('scoreId')}
            value={scoreId}
            showCopy
            data-testid={`${dataTestid}-copy`}
          />
          <StyledTitleSmall sx={{ m: theme.spacing(2.4, 0, 1.2, 0) }}>
            {t('rangeOfScores')}
          </StyledTitleSmall>
          <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>{scoreRangeLabel}</StyledBodyLarge>
        </Box>
      </StyledFlexTopStart>
      <StyledTitleMedium sx={{ mb: theme.spacing(1.2) }}>{t('scoreItems')}</StyledTitleMedium>
      <TransferListController
        name={`${name}.itemsScore`}
        items={tableItems}
        columns={scoreItemsColumns}
        selectedItemsColumns={selectedItemsColumns}
        hasSelectedSection
        searchKey="label"
        hasSearch
        sxProps={{ mb: theme.spacing(2.5) }}
        isValueName
        data-testid={`${dataTestid}-items-score`}
        tooltipByDefault
      />
      <SectionScoreCommonFields name={name} sectionId={`score-${index}`} data-testid={dataTestid} />
      {!!scoreConditionals?.length && (
        <>
          <StyledTitleMedium sx={{ m: theme.spacing(2.4, 0) }}>
            {t('scoreConditions')}
          </StyledTitleMedium>
          {scoreConditionals?.map((conditional: ScoreConditionalLogic, key: number) => {
            const conditionalName = `${scoreConditionalsName}.${key}`;
            const title = t('scoreConditional', {
              index: key + 1,
            });
            const headerTitle = <Title title={title} name={conditional?.name} />;
            const conditionalDataTestid = `${dataTestid}-conditional-${key}`;

            return (
              <ToggleItemContainer
                key={`data-score-conditional-${getEntityKey(conditional) || key}-${key}`}
                HeaderContent={SectionScoreHeader}
                Content={ScoreCondition}
                contentProps={{
                  name: conditionalName,
                  scoreId,
                  scoreKey: `score-condition-${index}-${key}`,
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
          data-testid={`${dataTestid}-remove-conditional-logic-popup`}
        />
      )}
    </StyledFlexColumn>
  );
};
