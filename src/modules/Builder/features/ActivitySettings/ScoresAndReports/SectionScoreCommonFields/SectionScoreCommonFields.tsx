import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { EditorUiType, Switch, TransferListController } from 'shared/components/FormComponents';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { StyledEditor } from './SectionScoreCommonFields.styles';
import { CommonFieldsProps } from './SectionScoreCommonFields.types';
import { getColumns } from './SectionScoreCommonFields.utils';

export const SectionScoreCommonFields = ({
  name,
  sectionId,
  tableHeadBackground,
  'data-testid': dataTestid,
  items,
}: CommonFieldsProps) => {
  const { t } = useTranslation();

  const { control, getFieldState, setValue, getValues, trigger, clearErrors } = useFormContext();

  const showMessageName = `${name}.showMessage`;
  const printItemsName = `${name}.printItems`;
  const itemsPrintName = `${name}.itemsPrint`;
  const messageName = `${name}.message`;
  const scoreConditionalLogicName = `${name}.conditionalLogic`;
  const [showMessage, printItems, scoreConditionalLogic] = useWatch({
    name: [showMessageName, printItemsName, scoreConditionalLogicName],
  });
  const printItemsError = getFieldState(printItemsName).error;

  useEffect(() => {
    const itemsPrint = getValues(itemsPrintName);
    const message = getValues(messageName);
    printItems ?? setValue(printItemsName, !!itemsPrint?.length);
    showMessage ?? setValue(showMessageName, !!message?.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    trigger(printItemsName);
  }, [printItems, showMessage, scoreConditionalLogic, printItemsName, trigger]);

  return (
    <>
      {!!printItemsError && (
        <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }} color={variables.palette.error}>
          {printItemsError.message}
        </StyledBodyMedium>
      )}
      <Box sx={{ mb: theme.spacing(1) }}>
        <Switch
          name={`${name}.showMessage`}
          label={t('showMessage')}
          tooltipText={t('showMessageTooltip')}
          control={control}
          data-testid={`${dataTestid}-show-message`}
        />
      </Box>
      {showMessage && (
        <StyledEditor
          uiType={EditorUiType.Secondary}
          name={messageName}
          key={messageName}
          control={control}
          editorId={`editor-${sectionId}`}
          data-testid={`${dataTestid}-show-message-text`}
          withDebounce
        />
      )}
      <Box sx={{ m: theme.spacing(0.5, 0, 1) }}>
        <Switch
          name={`${name}.printItems`}
          label={t('printItems')}
          tooltipText={t('printItemsTooltip')}
          control={control}
          data-testid={`${dataTestid}-print-items`}
        />
      </Box>
      {printItems && (
        <TransferListController
          name={itemsPrintName}
          items={items}
          columns={getColumns()}
          hasSearch={false}
          hasSelectedSection={false}
          tableHeadBackground={tableHeadBackground}
          data-testid={`${dataTestid}-print-items-list`}
          onChangeSelectedCallback={(newSelectedItems) => {
            // Clear errors immediately when user selects/deselects items
            clearErrors(itemsPrintName);
            // Trigger validation after selection change
            setTimeout(() => {
              trigger(itemsPrintName);
            }, 100);
          }}
        />
      )}
    </>
  );
};
