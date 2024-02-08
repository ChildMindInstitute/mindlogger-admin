import { Trans, useTranslation } from 'react-i18next';

import {
  getItemConditionDependencies,
  getItemsWithVariable,
} from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { ConditionalPanel } from 'modules/Builder/features/ActivityItems/ConditionalPanel';
import { useCurrentActivity, useFilterConditionalLogicByItem, useCustomFormContext } from 'modules/Builder/hooks';
import { ActivityFlowFormValues, ItemFormValues, SubscaleFormValue } from 'modules/Builder/types';
import { Modal } from 'shared/components';
import { ScoreReportType } from 'shared/consts';
import { ConditionalLogic, ScoreOrSection } from 'shared/state';
import { StyledBodyLarge, StyledModalWrapper, theme } from 'shared/styles';
import { getEntityKey } from 'shared/utils';

import { DeleteItemModalProps } from './DeleteItemModal.types';

export const DeleteItemModal = ({
  itemIdToDelete,
  activeItemIndex,
  onClose,
  onRemoveItem,
  onSetActiveItem,
}: DeleteItemModalProps) => {
  const { t } = useTranslation('app');
  const { fieldName, activity } = useCurrentActivity();
  const { watch, setValue, trigger } = useCustomFormContext();
  const subscalesField = `${fieldName}.subscaleSetting.subscales`;
  const reportsField = `${fieldName}.scoresAndReports.reports`;
  const subscales: SubscaleFormValue[] = watch(subscalesField) ?? [];
  const reports: ScoreOrSection[] = watch(reportsField) ?? [];
  const items: ItemFormValues[] = watch(`${fieldName}.items`) ?? [];
  const activityFlows: ActivityFlowFormValues[] = watch('activityFlows') ?? [];
  const itemIndexToDelete = items?.findIndex(item => itemIdToDelete === getEntityKey(item));
  const itemToDelete = items?.[itemIndexToDelete];
  const itemName = itemToDelete?.name;
  const filterConditionalLogicByItem = useFilterConditionalLogicByItem(itemToDelete);
  const conditionalLogicForItemToDelete = getItemConditionDependencies(itemToDelete, activity?.conditionalLogic);
  const itemsWithVariablesToRemove = getItemsWithVariable(itemToDelete?.name, items);
  const itemsWithVariablesToRemoveString = itemsWithVariablesToRemove.map(item => item.name).join(', ');

  const handleRemoveItem = (index: number) => {
    onRemoveItem(index);

    if (activityFlows.some(flow => flow.reportIncludedItemName === itemIdToDelete)) {
      const newActivityFlows = activityFlows.map(flow => {
        if (flow.reportIncludedItemName === itemIdToDelete) {
          return {
            ...flow,
            reportIncludedActivityName: '',
            reportIncludedItemName: '',
          };
        }

        return flow;
      });

      setValue('activityFlows', newActivityFlows);
    }
    if (activity?.reportIncludedItemName === itemIdToDelete) {
      setValue(`${fieldName}.reportIncludedItemName`, '');
    }
    setValue(`${fieldName}.items`, items?.filter((_, key) => key !== index));

    if (itemsWithVariablesToRemove.length) {
      for (const item of itemsWithVariablesToRemove) {
        trigger(`${fieldName}.items.${index < item.index ? item.index - 1 : item.index}`);
      }
    }

    if (activeItemIndex === index && items?.length !== 1) {
      onSetActiveItem();
    }
  };

  const handleRemoveModalSubmit = () => {
    filterConditionalLogicByItem();
    if (subscales.length) {
      let shouldTriggerSubscales = false;
      subscales.forEach((subscale, subscaleIndex) => {
        const subscaleItemsField = `${subscalesField}.${subscaleIndex}.items`;
        const { items: subscaleItems } = subscale;

        if (subscaleItems?.includes(itemIdToDelete)) {
          shouldTriggerSubscales = true;
          setValue(
            subscaleItemsField,
            subscaleItems.filter(id => id !== itemIdToDelete),
          );
        }
      });
      shouldTriggerSubscales && trigger(subscalesField);
    }

    if (reports.length) {
      let shouldTriggerReports = false;

      reports.forEach((report, index) => {
        const { itemsPrint, conditionalLogic, type } = report;
        const reportField = `${reportsField}.${index}`;

        if (itemsPrint?.includes(itemIdToDelete)) {
          shouldTriggerReports = true;
          setValue(`${reportField}.itemsPrint`, itemsPrint?.filter(id => id !== itemIdToDelete));
        }
        if (type === ScoreReportType.Score) {
          const { itemsScore } = report;
          if (itemsScore?.includes(itemIdToDelete)) {
            shouldTriggerReports = true;
            setValue(`${reportField}.itemsScore`, itemsScore?.filter(id => id !== itemIdToDelete));
          }
          conditionalLogic?.forEach((conditional, conditionalIndex) => {
            const { itemsPrint: conditionalItemsPrint } = conditional;
            const conditionalLogicField = `${reportField}.conditionalLogic.${conditionalIndex}`;

            if (conditionalItemsPrint?.includes(itemIdToDelete)) {
              shouldTriggerReports = true;
              setValue(
                `${conditionalLogicField}.itemsPrint`,
                conditionalItemsPrint?.filter(id => id !== itemIdToDelete),
              );
            }
          });
        }
        if (type === ScoreReportType.Section && conditionalLogic) {
          const { conditions } = conditionalLogic;
          if (conditions?.some(condition => condition.itemName === itemIdToDelete)) {
            shouldTriggerReports = true;
            const newConditions = conditions.filter(condition => condition.itemName !== itemIdToDelete);
            setValue(`${reportField}.conditionalLogic.conditions`, newConditions);
          }
        }
      });
      shouldTriggerReports && trigger(reportsField);
    }

    handleRemoveItem(itemIndexToDelete);
    onClose();
  };

  const deleteItemWithConditionalsDesc = conditionalLogicForItemToDelete?.length
    ? t('deleteItemWithConditionalsDescription')
    : null;

  if (!itemIdToDelete) return null;

  return (
    <Modal
      open={!!itemIdToDelete}
      onClose={onClose}
      onSubmit={handleRemoveModalSubmit}
      onSecondBtnSubmit={onClose}
      title={itemsWithVariablesToRemove.length ? t('variablesWarning.title') : t('deleteItem')}
      buttonText={t('delete')}
      secondBtnText={t('cancel')}
      hasSecondBtn
      submitBtnColor="error"
      data-testid="builder-activity-items-delete-item-popup">
      <StyledModalWrapper>
        {itemsWithVariablesToRemove.length ? (
          <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
            <Trans i18nKey="deleteItemReferencedByVariable">
              By deleting{' '}
              <strong>
                {' '}
                <>{{ itemAsVariable: itemName }}</>
              </strong>
              , it will cause{' '}
              <strong>
                {' '}
                <>{{ itemsWithVariablesToRemove: itemsWithVariablesToRemoveString }}</>
              </strong>{' '}
              to fail
            </Trans>
          </StyledBodyLarge>
        ) : (
          <>
            <StyledBodyLarge sx={{ mb: theme.spacing(2.4) }}>
              <Trans i18nKey="deleteItemDescription">
                Are you sure you want to delete the Item
                <strong>
                  <>{{ itemName }}</>
                </strong>
                ?
              </Trans>{' '}
              {deleteItemWithConditionalsDesc}
            </StyledBodyLarge>
            {conditionalLogicForItemToDelete?.map((conditionalLogic: ConditionalLogic) => (
              <ConditionalPanel key={`condition-panel-${conditionalLogic.key}`} condition={conditionalLogic} />
            ))}
          </>
        )}
      </StyledModalWrapper>
    </Modal>
  );
};
