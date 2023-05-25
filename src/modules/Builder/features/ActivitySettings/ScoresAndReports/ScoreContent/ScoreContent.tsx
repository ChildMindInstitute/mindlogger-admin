import { useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  StyledBodyLarge,
  StyledBodyMedium,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledTitleMedium,
  StyledTitleSmall,
  theme,
  variables,
} from 'shared/styles';
import {
  InputController,
  SelectController,
  Switch,
  TransferListController,
} from 'shared/components/FormComponents';
import { Svg } from 'shared/components';
import { Item } from 'shared/state';
import { EditorUiType } from 'shared/components/FormComponents/EditorController/EditorController.types';
import { useCurrentActivity } from 'modules/Builder/hooks';

import {
  calculationTypes,
  columns,
  scoreItemsColumns,
  selectedItemsColumns,
} from './ScoreContent.const';
import { StyledButton, StyledEditor, StyledDuplicateButton } from './ScoreContent.styles';
import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { CalculationType, ScoreContentProps } from './ScoreContent.types';
import { generateScoreId, generateScoreRange } from './ScoreContent.utils';
import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';

export const ScoreContent = ({ name }: ScoreContentProps) => {
  const { t } = useTranslation('app');
  const { control, getFieldState, watch } = useFormContext();
  const { activity } = useCurrentActivity();
  const [isChangeScoreIdPopupVisible, setIsChangeScoreIdPopupVisible] = useState(false);
  const isScoreIdVariable = false;

  const showMessage: boolean = watch(`${name}.showMessage`);
  const printItems: boolean = watch(`${name}.printItems`);
  const scoreName: string = watch(`${name}'.name`);
  const calculationType: CalculationType = watch(`${name}'.calculationType`);
  const items = activity?.items
    .filter(checkOnItemTypeAndScore)
    .map(({ id, name, question }: Item) => ({ id, name, question }));
  const hasPrintItemsError = getFieldState(`${name}.printItems`).error as unknown as Record<
    string,
    FieldError
  >;

  useEffect(() => {
    isScoreIdVariable && setIsChangeScoreIdPopupVisible(true);
  }, [isScoreIdVariable, scoreName]);

  const copyScoreId = () => {
    navigator.clipboard.writeText(generateScoreId(scoreName, calculationType));
  };

  return (
    <StyledFlexColumn>
      <StyledFlexTopStart>
        <Box sx={{ mr: theme.spacing(4.8), width: '50%' }}>
          <InputController
            name={`${name}.name`}
            label={t('scoreName')}
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
            <StyledBodyLarge>{generateScoreId(scoreName, calculationType)}</StyledBodyLarge>
            <StyledDuplicateButton
              sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
              onClick={copyScoreId}
            >
              <Svg id="duplicate" width="20" height="20" />
            </StyledDuplicateButton>
          </StyledFlexTopCenter>
          <StyledTitleSmall sx={{ mb: theme.spacing(1.2) }}>{t('rangeOfScores')}</StyledTitleSmall>
          <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>{generateScoreRange()}</StyledBodyLarge>
        </Box>
      </StyledFlexTopStart>
      <StyledTitleMedium>{t('scoreItems')}</StyledTitleMedium>
      <StyledFlexTopStart
        sx={{ m: theme.spacing(1.2, 0, 4.4, 0), gap: theme.spacing(2), alignItems: 'flex-end' }}
      >
        <TransferListController
          name={`${name}.items`}
          items={items}
          columns={scoreItemsColumns}
          selectedItemsColumns={selectedItemsColumns}
          hasSelectedSection
          hasSearch
        />
      </StyledFlexTopStart>
      {hasPrintItemsError && (
        <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
          {t('validationMessages.mustShowMessageOrItems')}
        </StyledBodyMedium>
      )}
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
            items={items}
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
        />
      )}
    </StyledFlexColumn>
  );
};
