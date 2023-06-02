import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  StyledBodyLarge,
  StyledFlexColumn,
  StyledFlexTopCenter,
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
import { Item } from 'shared/state';
import { CalculationType } from 'shared/consts';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { getEntityKey } from 'shared/utils';

import {
  calculationTypes,
  getScoreConditionalDefault,
  scoreItemsColumns,
  selectedItemsColumns,
} from './ScoreContent.const';
import { StyledDuplicateButton } from './ScoreContent.styles';
import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { ScoreContentProps } from './ScoreContent.types';
import {
  getScoreId,
  getScoreRange,
  getScoreRangeLabel,
  getTableScoreItems,
} from './ScoreContent.utils';
import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';
import { StyledButton } from '../ScoresAndReports.styles';
import { SectionScoreHeader } from '../SectionScoreHeader';
import { SectionScoreCommonFields } from '../SectionScoreCommonFields';
import { ScoreCondition } from './ScoreCondition';

export const ScoreContent = ({ name }: ScoreContentProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const { activity } = useCurrentActivity();
  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const isScoreIdVariable = false;

  const scoreConditionalsName = `${name}.conditionalLogic`;

  const scoreConditionals = watch(scoreConditionalsName);
  const scoreName: string = watch(`${name}.name`);
  const calculationType: CalculationType = watch(`${name}.calculationType`);
  const itemsScore: string[] = watch(`${name}.itemsScore`);
  const scoreId = getScoreId(scoreName, calculationType);
  const items: Item[] = activity?.items.filter(checkOnItemTypeAndScore);
  const tableItems = getTableScoreItems(items);
  const [scoreRangeLabel, setScoreRangeLabel] = useState<string>('-');

  const { append: appendScoreConditional, remove: removeScoreConditional } = useFieldArray({
    control,
    name: scoreConditionalsName,
  });

  const handleAddScoreConditional = () => {
    appendScoreConditional({});
  };

  useEffect(() => {
    isScoreIdVariable && setIsChangeScoreIdPopupVisible(true);
  }, [isScoreIdVariable, scoreName]);

  useEffect(() => {
    const selectedItems = items.filter((item) => itemsScore.includes(getEntityKey(item)));
    const { minScore, maxScore } = getScoreRange(selectedItems, calculationType);
    setScoreRangeLabel(getScoreRangeLabel(minScore, maxScore));
    setValue(`${name}.minScore`, minScore);
    setValue(`${name}.maxScore`, maxScore);
  }, [itemsScore, calculationType]);

  const copyScoreId = () => {
    navigator.clipboard.writeText(scoreId);
  };

  const onChangeScoreId = () => {
    setValue(`${name}.id`, scoreId);
  };

  return (
    <StyledFlexColumn>
      <StyledFlexTopStart>
        <Box sx={{ mr: theme.spacing(4.8), width: '50%' }}>
          <InputController
            control={control}
            name={`${name}.name`}
            label={t('scoreName')}
            onBlur={() => setValue(`${name}.id`, scoreId)}
            sx={{ mb: theme.spacing(4.8) }}
          />
          <SelectController
            name={`${name}.calculationType`}
            sx={{ mb: theme.spacing(4.8) }}
            control={control}
            options={calculationTypes}
            label={t('scoreCalculationType')}
            fullWidth
          />
        </Box>
        <Box>
          <StyledTitleSmall>{t('scoreId')}</StyledTitleSmall>
          <StyledFlexTopCenter>
            <StyledBodyLarge>{scoreId}</StyledBodyLarge>
            <StyledDuplicateButton
              sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
              onClick={copyScoreId}
            >
              <Svg id="duplicate" width="20" height="20" />
            </StyledDuplicateButton>
          </StyledFlexTopCenter>
          <StyledTitleSmall sx={{ mb: theme.spacing(1.2) }}>{t('rangeOfScores')}</StyledTitleSmall>
          <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>{scoreRangeLabel}</StyledBodyLarge>
        </Box>
      </StyledFlexTopStart>
      <StyledTitleMedium>{t('scoreItems')}</StyledTitleMedium>
      <StyledFlexTopStart sx={{ m: theme.spacing(1.2, 0, 4.4, 0), alignItems: 'flex-end' }}>
        <TransferListController
          name={`${name}.itemsScore`}
          items={tableItems}
          columns={scoreItemsColumns}
          selectedItemsColumns={selectedItemsColumns}
          hasSelectedSection
          hasSearch
        />
      </StyledFlexTopStart>
      <SectionScoreCommonFields name={name} />
      {!!scoreConditionals?.length && (
        <>
          <StyledTitleMedium sx={{ m: theme.spacing(2.4, 0) }}>
            {t('scoreConditions')}
          </StyledTitleMedium>
          {scoreConditionals?.map((conditional: any, index: number) => {
            const conditionalName = `${scoreConditionalsName}.${index}`;
            const title = t('scoreConditional', {
              index: index + 1,
            });

            return (
              <ToggleItemContainer
                key={`data-score-conditional-${getEntityKey(conditional) || index}`}
                HeaderContent={SectionScoreHeader}
                Content={ScoreCondition}
                contentProps={{ name: conditionalName }}
                headerContentProps={{
                  onRemove: () => {
                    removeScoreConditional(index);
                  },
                  title,
                }}
                uiType={ToggleContainerUiType.Score}
              />
            );
          })}
        </>
      )}
      <StyledButton
        startIcon={<Svg id="add" width="20" height="20" />}
        onClick={handleAddScoreConditional}
      >
        {t('addScoreCondition')}
      </StyledButton>
      {isChangeScoreIdPopupVisible && (
        <ChangeScoreIdPopup
          isOpen={isChangeScoreIdPopupVisible}
          onClose={() => setIsChangeScoreIdPopupVisible(false)}
          onChange={onChangeScoreId}
        />
      )}
    </StyledFlexColumn>
  );
};
