import { Grid } from '@mui/material';
import { useRef, useState, useMemo, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { useCheckAndTriggerOnNameUniqueness, useCustomFormContext } from 'modules/Builder/hooks';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';
import { useFilterConditionalLogicByItem } from 'modules/Builder/hooks/useFilterConditionalLogicByItem';
import { ItemTestFunctions } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.const';
import { ItemFormValues, ItemResponseTypeNoPerfTasks } from 'modules/Builder/types';
import { EditorController, InputController } from 'shared/components/FormComponents';
import { Modal } from 'shared/components/Modal';
import { EHRAvailableModal } from 'shared/components/Modal/EHRModals';
import { ItemResponseType } from 'shared/consts';
import { BuilderContainer } from 'shared/features';
import { useFeatureFlags } from 'shared/hooks';
import {
  StyledBodyMedium,
  StyledModalWrapper,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';

import { ConfigurationHeader } from './ConfigurationHeader';
import { EditItemModal } from './EditItemModal';
import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { itemsTypePlaceholders } from './ItemConfiguration.const';
import {
  useCheckIfItemHasVariables,
  useGetAvailableItemTypeOptions,
} from './ItemConfiguration.hooks';
import { ItemConfigurationProps } from './ItemConfiguration.types';
import { getInputTypeTooltip } from './ItemConfiguration.utils';
import { OptionalItemsAndSettings, OptionalItemsRef } from './OptionalItemsAndSettings';

export const ItemConfiguration = ({ name, onClose }: ItemConfigurationProps) => {
  const { t } = useTranslation('app');
  const [isEhrModalOpen, setIsEhrModalOpen] = useState(false);
  const { featureFlags } = useFeatureFlags();
  const optionalItemsRef = useRef<OptionalItemsRef | null>(null);
  const [isEditItemPopupVisible, setIsEditItemPopupVisible] = useState(false);
  const selectChangeRef = useRef<undefined | (() => void)>();
  const { control, getFieldState, setValue, getValues, setError, clearErrors } =
    useCustomFormContext();

  const { fieldName, activity } = useCurrentActivity();
  const { message, isPopupVisible, onPopupConfirm } = useCheckIfItemHasVariables(name);
  const responseType: ItemResponseTypeNoPerfTasks = useWatch({
    name: `${name}.responseType`,
    control,
  });

  const currentItem: ItemFormValues = useMemo(
    () => getValues(name) as ItemFormValues,
    [getValues, name],
  );

  const filterConditionalLogicByItem = useFilterConditionalLogicByItem(currentItem);
  const conditionalLogicForItem = useMemo(
    () => getItemConditionDependencies(currentItem, activity?.conditionalLogic),
    [currentItem, activity?.conditionalLogic],
  );

  const availableItemsTypeOptions = useGetAvailableItemTypeOptions(name);

  useCheckAndTriggerOnNameUniqueness({
    currentPath: name,
    entitiesFieldPath: `${fieldName}.items`,
  });

  const handleModalSubmit = () => {
    selectChangeRef.current?.();
    filterConditionalLogicByItem();
  };

  const handleBeforeChange = (newValue: ItemResponseType) => {
    if (
      newValue === ItemResponseType.RequestHealthRecordData &&
      featureFlags.enableEhrHealthData === 'available'
    ) {
      setIsEhrModalOpen(true);

      return false;
    }

    return true;
  };

  const prepareSelectChangePopup = (handleOnChange: () => void) => {
    setIsEditItemPopupVisible(true);
    selectChangeRef.current = handleOnChange;
  };
  const checkIfSelectChangePopupIsVisible = conditionalLogicForItem?.length
    ? prepareSelectChangePopup
    : undefined;

  const containerSxProps = {
    margin: 0,
    flexGrow: 1,
    height: '100%',
  };
  const itemNameHelperTextSxProps = {
    '&&': {
      top: '100%',
      whiteSpace: 'normal',
      overflow: 'unset',
      bottom: 'unset',
    },
  };

  const hasSameNameInSystemItemsError =
    getFieldState(`${name}.name`)?.error?.type === ItemTestFunctions.ExistingNameInSystemItem;

  // Inline validation for question without modifying shared controller.
  const questionValue: string = useWatch({ name: `${name}.question`, control }) || '';
  const initialValueRef = useRef(questionValue);
  const hasUserTypedRef = useRef(false);

  useEffect(() => {
    if (questionValue !== initialValueRef.current) {
      hasUserTypedRef.current = true;
    }

    // Only validate if user has interacted with this field
    if (!hasUserTypedRef.current) {
      return;
    }

    const trimmed = questionValue.trim();

    if (!trimmed) {
      setError(`${name}.question`, {
        type: 'required',
        message: t('displayedContentRequired'),
      });
    } else {
      clearErrors(`${name}.question`);
    }
  }, [questionValue, name, setError, clearErrors, t]);

  return (
    <>
      <BuilderContainer
        title={t('itemConfiguration')}
        Header={ConfigurationHeader}
        headerProps={{
          responseType,
          optionalItemsRef,
          onClose,
        }}
        sxProps={containerSxProps}
      >
        <Grid container direction="row" columns={2} spacing={2.4}>
          <Grid item xs={1}>
            <GroupedSelectSearchController
              name={`${name}.responseType`}
              options={availableItemsTypeOptions}
              checkIfSelectChangePopupIsVisible={checkIfSelectChangePopupIsVisible}
              control={control}
              setValue={setValue}
              fieldName={name}
              data-testid="builder-activity-items-item-configuration-response-type"
              onBeforeChange={handleBeforeChange}
            />
            <StyledBodyMedium
              sx={{ m: theme.spacing(0.2, 1.6, 4.8, 1.6) }}
              color={variables.palette.on_surface_variant}
            >
              {responseType && getInputTypeTooltip()[responseType]}
            </StyledBodyMedium>
          </Grid>
          <Grid item xs={1}>
            <InputController
              fullWidth
              withDebounce
              name={`${name}.name`}
              control={control}
              label={t('itemName')}
              type="text"
              sx={{ mb: theme.spacing(4) }}
              data-testid="builder-activity-items-item-configuration-name"
              FormHelperTextProps={{
                ...(hasSameNameInSystemItemsError && { sx: itemNameHelperTextSxProps }),
              }}
            />
          </Grid>
        </Grid>
        <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>{t('displayedContent')}</StyledTitleLarge>
        <EditorController
          name={`${name}.question`}
          control={control}
          placeholder={itemsTypePlaceholders[responseType]}
          data-testid="builder-activity-items-item-configuration-description"
        />
        <OptionalItemsAndSettings name={name} ref={optionalItemsRef} />
      </BuilderContainer>
      {isPopupVisible && (
        <Modal
          open
          onClose={onPopupConfirm}
          onSubmit={onPopupConfirm}
          width={'62'}
          title={t('variablesWarning.title')}
          buttonText={t('ok')}
          data-testid="builder-activity-items-item-configuration-variables-warning-popup"
        >
          <StyledModalWrapper>{t(message)}</StyledModalWrapper>
        </Modal>
      )}
      <EHRAvailableModal open={isEhrModalOpen} onClose={() => setIsEhrModalOpen(false)} />
      {isEditItemPopupVisible && (
        <EditItemModal
          open
          itemFieldName={name}
          onClose={() => setIsEditItemPopupVisible(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
};
