import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
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
  Switch,
  TransferListController,
} from 'shared/components/FormComponents';
import { DataTableItem, Svg } from 'shared/components';
import { Item } from 'shared/state';
import { CalculationType } from 'shared/consts';
import { EditorUiType } from 'shared/components/FormComponents/EditorController/EditorController.types';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { getEntityKey } from 'shared/utils';

import {
  calculationTypes,
  columns,
  scoreItemsColumns,
  selectedItemsColumns,
} from './ScoreContent.const';
import { StyledButton, StyledEditor, StyledDuplicateButton } from './ScoreContent.styles';
import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { ScoreContentProps } from './ScoreContent.types';
import {
  getScoreId,
  getScoreRange,
  getScoreRangeLabel,
  getTableScoreItems,
} from './ScoreContent.utils';
import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';

export const ScoreContent = ({ name }: ScoreContentProps) => {
  const { t } = useTranslation('app');
  const { control, watch, setValue } = useFormContext();
  const { activity } = useCurrentActivity();
  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const isScoreIdVariable = false;

  const showMessage: boolean = watch(`${name}.showMessage`);
  const printItems: boolean = watch(`${name}.printItems`);
  const scoreName: string = watch(`${name}.name`);
  const calculationType: CalculationType = watch(`${name}.calculationType`);
  const itemsScore: string[] = watch(`${name}.itemsScore`);
  const scoreId = getScoreId(scoreName, calculationType);
  const items: Item[] = activity?.items.filter(checkOnItemTypeAndScore);
  const tableItems = getTableScoreItems(items);
  const [scoreRangeLabel, setScoreRangeLabel] = useState<string>('-');

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
      <Switch
        name={`${name}.showMessage`}
        control={control}
        label={t('showMessage')}
        tooltipText={t('showMessageTooltip')}
      />
      {showMessage && (
        <StyledEditor uiType={EditorUiType.Secondary} name={`${name}.message`} control={control} />
      )}
      <Switch
        name={`${name}.printItems`}
        control={control}
        label={t('printItems')}
        tooltipText={t('printItemsTooltip')}
      />
      {printItems && (
        <StyledFlexTopStart sx={{ mb: theme.spacing(2.4) }}>
          <TransferListController
            name={`${name}.itemsPrint`}
            items={items as unknown as DataTableItem[]}
            columns={columns}
            hasSearch={false}
            hasSelectedSection={false}
          />
        </StyledFlexTopStart>
      )}
      <StyledButton startIcon={<Svg id="add" width="20" height="20" />}>
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
