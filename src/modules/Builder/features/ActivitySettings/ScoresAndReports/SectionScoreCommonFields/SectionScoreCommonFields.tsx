import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { EditorUiType, Switch, TransferListController } from 'shared/components/FormComponents';
import { StyledBodyMedium, StyledFlexTopStart, theme, variables } from 'shared/styles';
import { Item } from 'shared/state';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { DataTableItem } from 'shared/components';

import { CommonFieldsProps } from './SectionScoreCommonFields.types';
import { StyledEditor } from './SectionScoreCommonFields.styles';
import { checkOnItemTypeAndScore } from '../../ActivitySettings.utils';
import { columns } from './SectionScoreCommonFields.const';

export const SectionScoreCommonFields = ({ name }: CommonFieldsProps) => {
  const { t } = useTranslation();

  const { control, getFieldState, watch, register, unregister } = useFormContext();
  const { activity } = useCurrentActivity();

  const showMessage: boolean = watch(`${name}.showMessage`);
  const printItems: boolean = watch(`${name}.printItems`);
  const messageName = `${name}.message`;
  const itemsPrintName = `${name}.itemsPrint`;
  const hasPrintItemsError = !!getFieldState(`${name}.printItems`).error;

  const items = activity?.items.reduce(
    (items: Pick<Item, 'id' | 'name' | 'question'>[], item: Item) => {
      if (!checkOnItemTypeAndScore(item)) return items;
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
        <StyledEditor uiType={EditorUiType.Secondary} name={messageName} control={control} />
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
            name={itemsPrintName}
            items={items as unknown as DataTableItem[]}
            columns={columns}
            hasSearch={false}
            hasSelectedSection={false}
          />
        </StyledFlexTopStart>
      )}
    </>
  );
};
