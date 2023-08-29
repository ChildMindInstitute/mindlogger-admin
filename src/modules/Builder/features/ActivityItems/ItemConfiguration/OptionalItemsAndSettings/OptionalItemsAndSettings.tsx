import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useFieldArray, useWatch, useFormContext } from 'react-hook-form';
import { ColorResult } from 'react-color';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash.get';

import { SingleAndMultiSelectOption } from 'shared/state';
import { ItemResponseType } from 'shared/consts';
import { StyledFlexTopCenter, StyledTitleLarge, theme } from 'shared/styles';
import { Svg } from 'shared/components';

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
import { SelectionOption } from '../InputTypeItems';
import { OptionalItemsProps, OptionalItemsRef } from './OptionalItemsAndSettings.types';
import { SkippedItemInVariablesModal } from './SkippedItemInVariablesModal';
import { StyledOptionsWrapper } from './OptionalItemsAndSettings.styles';
import { useActiveItem, useSettingsSetup } from './OptionalItemsAndSettings.hooks';
import { getOptionValue } from './OptionalItemsAndSettings.utils';
import { ITEMS_TO_HAVE_RESPONSE_OPTIONS_HEADER } from './OptionalItemsAndSettings.const';

export const OptionalItemsAndSettings = forwardRef<OptionalItemsRef, OptionalItemsProps>(
  ({ name }, ref) => {
    const { t } = useTranslation('app');
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState<boolean[]>([]);

    const { control, setValue } = useFormContext();
    const [settings, responseType, responseValues, palette, alerts] = useWatch({
      control,
      name: [
        `${name}.config`,
        `${name}.responseType`,
        `${name}.responseValues`,
        `${name}.responseValues.paletteName`,
        `${name}.alerts`,
      ],
    });

    const [showColorPalette, setShowColorPalette] = useState(!!palette);

    const handleChangeColorPaletteVisibility = (visibility: boolean) => {
      setShowColorPalette(visibility);
      setValue(`${name}.responseValues.paletteName`, undefined);
    };
    const { append: appendAlert, remove: removeAlert } = useFieldArray({
      control,
      name: `${name}.alerts`,
    });
    const {
      fields: options,
      append: appendOption,
      remove: removeOptions,
      update: updateOptions,
    } = useFieldArray({
      control,
      name: `${name}.responseValues.options`,
    });

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
    const hasResponseOptionsHeader = ITEMS_TO_HAVE_RESPONSE_OPTIONS_HEADER.includes(responseType);

    const handleAddOption = async () => {
      await appendOption({
        id: uuidv4(),
        text: '',
        isHidden: false,
        ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
        ...(hasColorPalette &&
          palette && { color: { hex: getPaletteColor(palette, options.length) } as ColorResult }),
        value: getOptionValue(options ?? []),
      });
      setOptionsOpen((prevState) => [...prevState, true]);
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
      removeOptions(index);
      setOptionsOpen((prevState) => {
        const newOptionsOpen = [...prevState];
        newOptionsOpen.splice(index, 1);

        return newOptionsOpen;
      });
    };

    const handleUpdateOption = (index: number, option: SingleAndMultiSelectOption) => {
      updateOptions(index, option);
    };

    const handleRemoveAlert = (index: number) => {
      removeAlert(index);

      if (alerts?.length === 1) {
        setValue(`${name}.config.${ItemConfigurationSettings.HasAlerts}`, false);
      }
    };

    const handleRemoveTextInputOption = () => {
      setValue(`${name}.config.${ItemConfigurationSettings.HasTextInput}`, false);
      setValue(`${name}.config.${ItemConfigurationSettings.IsTextInputRequired}`, false);
    };

    const handleRemoveResponseDataIdentifier = () => {
      setValue(`${name}.config.${ItemConfigurationSettings.HasResponseDataIdentifier}`, false);
    };

    const activeItem = useActiveItem({
      name,
      responseType,
    });

    useEffect(() => {
      options?.length && setOptionsOpen(options.map(() => true));
    }, []);

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
      handleAddSliderRow,
      handleAddSingleOrMultipleRow,
      removeAlert,
      handleAddAlert,
      setShowColorPalette: handleChangeColorPaletteVisibility,
      setOptionsOpen,
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
              <ColorPalette name={name} setShowColorPalette={handleChangeColorPaletteVisibility} />
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
                      optionsOpen={optionsOpen}
                      setOptionsOpen={setOptionsOpen}
                    />
                  ))
                : null}
              <Button
                onClick={handleAddOption}
                variant="outlined"
                startIcon={<Svg id="add" width="20" height="20" />}
                data-testid="builder-activity-items-item-configuration-add-option"
              >
                {t('addOption')}
              </Button>
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
          <Alerts appendAlert={handleAddAlert} removeAlert={handleRemoveAlert} name={name} />
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
