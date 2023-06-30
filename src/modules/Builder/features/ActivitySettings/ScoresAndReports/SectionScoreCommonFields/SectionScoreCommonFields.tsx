import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/material';

import { EditorUiType, Switch, TransferListController } from 'shared/components/FormComponents';
import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { Item } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { DataTableItem } from 'shared/components';

import { CommonFieldsProps } from './SectionScoreCommonFields.types';
import { StyledEditor } from './SectionScoreCommonFields.styles';
import { ItemTypesToPrint, columns } from './SectionScoreCommonFields.const';

export const SectionScoreCommonFields = ({ name }: CommonFieldsProps) => {
  const { t } = useTranslation();

  const { control, getFieldState, watch, register, unregister } = useFormContext();
  const { activity } = useCurrentActivity();

  const showMessage: boolean = watch(`${name}.showMessage`);
  const printItems: boolean = watch(`${name}.printItems`);
  const messageName = `${name}.message`;
  const itemsPrintName = `${name}.itemsPrint`;
  const printItemsError = getFieldState(`${name}.printItems`).error;

  const commonProps = { control };

  const items = activity?.items.reduce(
    (items: Pick<Item, 'id' | 'name' | 'question'>[], item: Item) => {
      if (!ItemTypesToPrint.includes(item.responseType)) return items;
      const { id, name, question } = item;

      return [...items, { id, name, question }];
    },
    [],
  );

  useEffect(() => {
    if (showMessage) {
      register(messageName);

      return;
    }

    unregister(messageName, { keepDefaultValue: true });
  }, [showMessage]);

  useEffect(() => {
    if (printItems) {
      register(itemsPrintName);

      return;
    }

    unregister(itemsPrintName, { keepDefaultValue: true });
  }, [printItems]);

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
          {...commonProps}
        />
      </Box>
      {showMessage && (
        <StyledEditor uiType={EditorUiType.Secondary} name={messageName} control={control} />
      )}
      <Switch
        name={`${name}.printItems`}
        label={t('printItems')}
        tooltipText={t('printItemsTooltip')}
        {...commonProps}
      />
      {printItems && (
        <TransferListController
          name={itemsPrintName}
          items={items as unknown as DataTableItem[]}
          columns={columns}
          hasSearch={false}
          hasSelectedSection={false}
          isValueName
        />
      )}
    </>
  );
};
