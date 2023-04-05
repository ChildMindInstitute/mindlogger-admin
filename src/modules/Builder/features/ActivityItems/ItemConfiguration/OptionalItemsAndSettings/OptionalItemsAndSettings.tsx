import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { ColorResult } from 'react-color';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ItemInputTypes } from 'shared/types';
import { StyledFlexTopCenter, StyledTitleLarge, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { ItemConfigurationSettings } from '../ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE } from '../ItemConfiguration.const';
import { getPaletteColor } from '../ItemConfiguration.utils';
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
import { StyledOptionsWrapper } from './OptionalItemsAndSettings.styles';
import { useActiveItem, useSettingsSetup } from './OptionalItemsAndSettings.hooks';

export const OptionalItemsAndSettings = forwardRef<OptionalItemsRef, OptionalItemsProps>(
  (
    {
      setValue,
      getValues,
      watch,
      register,
      unregister,
      clearErrors,
      control,
      selectedInputType,
      settings,
      palette,
    },
    ref,
  ) => {
    const { t } = useTranslation('app');
    const [showColorPalette, setShowColorPalette] = useState(false);
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

    const {
      fields: alerts,
      append: appendAlert,
      remove: removeAlert,
    } = useFieldArray({
      control,
      name: 'alerts',
    });
    const {
      fields: options,
      append: appendOption,
      remove: removeOptions,
      update: updateOptions,
    } = useFieldArray({
      control,
      name: 'options',
    });

    const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);
    const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
    const hasOptions =
      selectedInputType === ItemInputTypes.SingleSelection ||
      selectedInputType === ItemInputTypes.MultipleSelection;
    const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);
    const hasColorPalette = settings?.includes(ItemConfigurationSettings.HasColorPalette);
    const hasResponseDataIdentifier = settings?.includes(
      ItemConfigurationSettings.HasResponseDataIdentifier,
    );

    const handleAddOption = () =>
      appendOption({
        text: '',
        isVisible: true,
        ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
        ...(hasColorPalette &&
          palette && { color: { hex: getPaletteColor(palette, options.length) } as ColorResult }),
      });

    const handleAddAlert = () =>
      appendAlert({
        option: '',
        item: '',
        message: '',
      });

    const handleRemoveAlert = (index: number) => {
      removeAlert(index);
      if (!getValues().alerts?.length) {
        setValue(
          'settings',
          settings?.filter(
            (settingKey: ItemConfigurationSettings) =>
              settingKey !== ItemConfigurationSettings.HasAlerts,
          ),
        );
      }
    };

    const handleRemoveTextInputOption = () => {
      setValue(
        'settings',
        settings?.filter(
          (settingKey: ItemConfigurationSettings) =>
            settingKey !== ItemConfigurationSettings.HasTextInput &&
            settingKey !== ItemConfigurationSettings.IsTextInputRequired,
        ),
      );
    };

    const handleRemoveResponseDataIdentifier = () => {
      setValue(
        'settings',
        settings?.filter(
          (settingKey: ItemConfigurationSettings) =>
            settingKey !== ItemConfigurationSettings.HasResponseDataIdentifier,
        ),
      );
    };

    const activeItem = useActiveItem({
      selectedInputType,
      control,
    });

    useImperativeHandle(
      ref,
      () => ({
        setSettingsDrawerVisible,
      }),
      [],
    );

    useSettingsSetup({
      setValue,
      getValues,
      watch,
      register,
      unregister,
      clearErrors,
      removeOptions,
      handleAddOption,
      removeAlert,
      handleAddAlert,
      setShowColorPalette,
    });

    return (
      <>
        {hasOptions && (
          <>
            <StyledFlexTopCenter
              sx={{ m: theme.spacing(4.8, 0, 2.4), justifyContent: 'space-between' }}
            >
              <StyledTitleLarge>{t('responseOptions')}</StyledTitleLarge>
              {hasColorPalette && !showColorPalette && (
                <Button
                  onClick={() => setShowColorPalette(true)}
                  variant="outlined"
                  startIcon={<Svg id="paint-outline" width="20" height="20" />}
                >
                  {t('setPalette')}
                </Button>
              )}
            </StyledFlexTopCenter>
            {hasColorPalette && showColorPalette && (
              <ColorPalette setShowColorPalette={setShowColorPalette} />
            )}
            <StyledOptionsWrapper>
              {options?.length
                ? options.map((option, index) => (
                    <SelectionOption
                      key={option.id}
                      onRemoveOption={removeOptions}
                      onUpdateOption={updateOptions}
                      optionsLength={options.length}
                      index={index}
                    />
                  ))
                : null}
              <Button
                onClick={handleAddOption}
                variant="outlined"
                startIcon={<Svg id="add" width="20" height="20" />}
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
        {isTextInputOptionVisible && <TextInputOption onRemove={handleRemoveTextInputOption} />}
        {hasAlerts && (
          <Alerts appendAlert={handleAddAlert} removeAlert={handleRemoveAlert} alerts={alerts} />
        )}
        {settingsDrawerVisible && (
          <ItemSettingsDrawer
            open={settingsDrawerVisible}
            onClose={() => setSettingsDrawerVisible(false)}
          >
            <ItemSettingsController
              name="settings"
              inputType={selectedInputType}
              control={control}
            />
          </ItemSettingsDrawer>
        )}
      </>
    );
  },
);
