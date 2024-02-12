import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useWatch, useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { EditorUiType, Switch, TransferListController } from 'shared/components/FormComponents';
import { StyledBodyMedium, theme, variables } from 'shared/styles';

import { CommonFieldsProps } from './SectionScoreCommonFields.types';
import { StyledEditor } from './SectionScoreCommonFields.styles';
import { getColumns } from './SectionScoreCommonFields.utils';

export const SectionScoreCommonFields = ({
  name,
  sectionId,
  tableHeadBackground,
  'data-testid': dataTestid,
  items,
}: CommonFieldsProps) => {
  const { t } = useTranslation();

  const { control, getFieldState, register, unregister, setValue, getValues, trigger } =
    useFormContext();

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
  }, []);

  useEffect(() => {
    if (showMessage) {
      register(messageName);

      return;
    }

    unregister(messageName, { keepValue: true });
  }, [showMessage]);

  useEffect(() => {
    if (printItems) {
      register(itemsPrintName);

      return;
    }

    unregister(itemsPrintName, { keepValue: true });
  }, [printItems]);

  useEffect(() => {
    trigger(printItemsName);
  }, [printItems, showMessage, scoreConditionalLogic]);

  return (
    <>
      {!!printItemsError && (
        <StyledBodyMedium sx={{ mb: theme.spacing(2.4) }} color={variables.palette.semantic.error}>
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
        />
      )}
    </>
  );
};
