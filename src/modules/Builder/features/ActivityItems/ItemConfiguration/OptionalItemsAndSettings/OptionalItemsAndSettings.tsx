import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { ColorResult } from 'react-color';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash.get';

import { SingleAndMultiSelectOption } from 'shared/state';
import { ItemResponseType } from 'shared/consts';
import { StyledFlexTopCenter, StyledTitleLarge, theme, variables } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { REACT_HOOK_FORM_KEY_NAME } from 'modules/Builder/consts';

import { ItemConfigurationSettings } from '../ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE } from '../ItemConfiguration.const';
import {
  getPaletteColor,
  getEmptySliderOption,
  getEmptySelectionItem,
  getEmptySelectionItemOption,
  getEmptyAlert,
} from '../ItemConfiguration.utils';
import {
  ColorPalette,
  ItemSettingsController,
  ItemSettingsDrawer,
  TextInputOption,
  ResponseDataIdentifier,
} from '../Settings';
import { Alerts } from '../Alerts';
import { SelectionOption } from '../InputTypeItems/SelectionOption';
import {
  OptionalItemsProps,
  OptionalItemsRef,
  HandleAddOptionProps,
} from './OptionalItemsAndSettings.types';
import { SkippedItemInVariablesModal } from './SkippedItemInVariablesModal';
import { StyledOptionsWrapper } from './OptionalItemsAndSettings.styles';
import { useActiveItem, useSettingsSetup } from './OptionalItemsAndSettings.hooks';
import { getOptionValue } from './OptionalItemsAndSettings.utils';
import {
  DEFAULT_OPTION_VALUE,
  ITEMS_TO_HAVE_RESPONSE_OPTIONS_HEADER,
} from './OptionalItemsAndSettings.const';

// Feature disabled until release 1.14
const isNoneAboveFeatureFlag = false;

export const OptionalItemsAndSettings = forwardRef<OptionalItemsRef, OptionalItemsProps>(
  ({ name }, ref) => {
    const { t } = useTranslation('app');
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

    const { control, setValue } = useFormContext();
    const [settings, responseType, responseValues, palette] = useWatch({
      control,
      name: [
        `${name}.config`,
        `${name}.responseType`,
        `${name}.responseValues`,
        `${name}.responseValues.paletteName`,
      ],
    });

    const [showColorPalette, setShowColorPalette] = useState(!!palette);

    const handleChangeColorPaletteVisibility = (visibility: boolean) => {
      setShowColorPalette(visibility);
      setValue(`${name}.responseValues.paletteName`, undefined);
    };

    const {
      fields: alerts,
      append: appendAlert,
      remove: removeAlert,
    } = useFieldArray({
      control,
      name: `${name}.alerts`,
    });

    const {
      fields: options,
      append: appendOption,
      remove: removeOptions,
      update: updateOptions,
    } = useFieldArray<
      Record<string, SingleAndMultiSelectOption[]>,
      string,
      typeof REACT_HOOK_FORM_KEY_NAME
    >({
      control,
      name: `${name}.responseValues.options`,
      keyName: REACT_HOOK_FORM_KEY_NAME,
    });
    const isMultipleSelection = responseType === ItemResponseType.MultipleSelection;
    const [hasNoneOption, setHasNoneOption] = useState(
      isMultipleSelection && options.some((option) => option.isNoneAbove),
    );

    const { append: appendRow } = useFieldArray({
      control,
      name: `${name}.responseValues.rows`,
    });

    const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
    const isTextInputOptionVisible = get(settings, ItemConfigurationSettings.HasTextInput);
    const hasOptions =
      responseType === ItemResponseType.SingleSelection ||
      responseType === ItemResponseType.MultipleSelection;
    const hasScores = get(settings, ItemConfigurationSettings.HasScores);
    const hasColorPalette = get(settings, ItemConfigurationSettings.HasColorPalette);
    const hasResponseDataIdentifier = get(
      settings,
      ItemConfigurationSettings.HasResponseDataIdentifier,
    );
    const hasResponseOptionsHeader = ITEMS_TO_HAVE_RESPONSE_OPTIONS_HEADER.includes(
      responseType as ItemResponseType,
    );

    const handleAddOption = async ({ isAppendedOption, ...rest }: HandleAddOptionProps) => {
      await appendOption({
        id: uuidv4(),
        text: '',
        isHidden: false,
        ...(isAppendedOption && hasScores && { score: DEFAULT_SCORE_VALUE }),
        ...(isAppendedOption &&
          hasColorPalette &&
          palette && { color: { hex: getPaletteColor(palette, options.length) } as ColorResult }),
        value: isAppendedOption ? getOptionValue(options ?? []) : DEFAULT_OPTION_VALUE,
        ...rest,
      });
    };

    const handleAddNoneOption = async () => {
      await handleAddOption({
        isAppendedOption: true,
        text: t('placeholderForNoneOption'),
        isNoneAbove: true,
      });
      setHasNoneOption(true);
    };

    const handleAddSingleOrMultipleRow = () => {
      appendRow(getEmptySelectionItem());
      appendOption(getEmptySelectionItemOption());
    };

    const handleAddSliderRow = () => {
      appendRow([
        getEmptySliderOption({ isMultiple: true, hasScores }),
        getEmptySliderOption({ isMultiple: true, hasScores }),
      ]);
    };

    const handleAddAlert = () =>
      appendAlert(getEmptyAlert({ responseType, responseValues, config: settings }));

    const handleRemoveOptions = (index: number) => {
      if (isMultipleSelection) {
        const optionItem = options[index];
        const isNoneAbove = optionItem.isNoneAbove;
        isNoneAbove && setHasNoneOption(false);
      }
      removeOptions(index);
    };

    const handleUpdateOption = (index: number, option: SingleAndMultiSelectOption) => {
      updateOptions(index, option);
    };

    const handleRemoveAlert = (index: number) => {
      removeAlert(index);

      if (alerts?.length === 1) {
        setValue(`${name}.config.${ItemConfigurationSettings.HasAlerts}`, false, {
          shouldDirty: true,
        });
      }
    };

    const handleRemoveTextInputOption = () => {
      setValue(`${name}.config.${ItemConfigurationSettings.HasTextInput}`, false, {
        shouldDirty: true,
      });
      setValue(`${name}.config.${ItemConfigurationSettings.IsTextInputRequired}`, false, {
        shouldDirty: true,
      });
    };

    const handleRemoveResponseDataIdentifier = () => {
      setValue(`${name}.config.${ItemConfigurationSettings.HasResponseDataIdentifier}`, false, {
        shouldDirty: true,
      });
    };

    const handleRemovePalette = () => {
      handleChangeColorPaletteVisibility(false);

      options?.forEach((option, index) =>
        updateOptions(index, {
          ...option,
          color: undefined,
        }),
      );
    };

    const activeItem = useActiveItem({
      name,
      responseType,
    });

    useImperativeHandle(
      ref,
      () => ({
        setSettingsDrawerVisible,
      }),
      [],
    );

    useSettingsSetup({
      name,
      handleAddOption,
      removeOptions,
      handleAddSliderRow,
      handleAddSingleOrMultipleRow,
      removeAlert,
      handleAddAlert,
    });

    return (
      <>
        {hasResponseOptionsHeader && (
          <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
            {t('responseOptions')}
          </StyledTitleLarge>
        )}
        {hasOptions && (
          <>
            {hasColorPalette && !showColorPalette && (
              <StyledFlexTopCenter sx={{ mb: theme.spacing(2.4), justifyContent: 'space-between' }}>
                <Button
                  onClick={() => handleChangeColorPaletteVisibility(true)}
                  variant="outlined"
                  startIcon={<Svg id="paint-outline" width="20" height="20" />}
                  data-testid="builder-activity-items-item-configuration-set-color-palette"
                >
                  {t('setPalette')}
                </Button>
              </StyledFlexTopCenter>
            )}
            {hasColorPalette && showColorPalette && (
              <ColorPalette name={name} onRemovePalette={handleRemovePalette} />
            )}
            <StyledOptionsWrapper>
              {options?.length
                ? options.map((option, index) => (
                    <SelectionOption
                      key={option.id}
                      name={name}
                      onRemoveOption={handleRemoveOptions}
                      onUpdateOption={handleUpdateOption}
                      optionsLength={options.length}
                      index={index}
                    />
                  ))
                : null}
              <Button
                onClick={() => handleAddOption({ isAppendedOption: true })}
                variant="outlined"
                startIcon={<Svg id="add" width="20" height="20" />}
                data-testid="builder-activity-items-item-configuration-add-option"
              >
                {t('addOption')}
              </Button>
              {isNoneAboveFeatureFlag && isMultipleSelection && (
                <Button
                  onClick={() => handleAddNoneOption()}
                  variant="text"
                  startIcon={<Svg id="add" width="20" height="20" />}
                  data-testid="builder-activity-items-item-configuration-add-none-option"
                  sx={{ ml: theme.spacing(1), color: variables.palette.on_surface_variant }}
                  disabled={hasNoneOption}
                >
                  {t('addNoneOption')}
                </Button>
              )}
            </StyledOptionsWrapper>
          </>
        )}
        {activeItem}
        {hasResponseDataIdentifier && (
          <ResponseDataIdentifier onRemove={handleRemoveResponseDataIdentifier} />
        )}
        {isTextInputOptionVisible && (
          <TextInputOption name={name} onRemove={handleRemoveTextInputOption} />
        )}
        {hasAlerts && (
          <Alerts
            alerts={alerts}
            appendAlert={handleAddAlert}
            removeAlert={handleRemoveAlert}
            name={name}
          />
        )}
        {settingsDrawerVisible && (
          <ItemSettingsDrawer
            open={settingsDrawerVisible}
            onClose={() => setSettingsDrawerVisible(false)}
          >
            <ItemSettingsController
              name={`${name}.config`}
              itemName={name}
              inputType={responseType}
              control={control}
            />
          </ItemSettingsDrawer>
        )}
        <SkippedItemInVariablesModal itemName={name} />
      </>
    );
  },
);
