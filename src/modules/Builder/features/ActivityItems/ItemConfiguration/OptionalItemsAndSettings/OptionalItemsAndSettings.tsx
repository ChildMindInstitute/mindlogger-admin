import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFieldArray, useWatch, useFormContext } from 'react-hook-form';
import { ColorResult } from 'react-color';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash.get';

import { SingleAndMultipleSelectionOption } from 'shared/state';
import { ItemResponseType } from 'shared/consts';
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
// import { Alerts } from '../Alerts';
import { SelectionOption } from '../InputTypeItems';
import { OptionalItemsProps, OptionalItemsRef } from './OptionalItemsAndSettings.types';
import { StyledOptionsWrapper } from './OptionalItemsAndSettings.styles';
import { useActiveItem, useSettingsSetup } from './OptionalItemsAndSettings.hooks';

export const OptionalItemsAndSettings = forwardRef<OptionalItemsRef, OptionalItemsProps>(
  ({ name }, ref) => {
    const { t } = useTranslation('app');
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

    const { control, setValue } = useFormContext();
    const [settings, responseType, palette] = useWatch({
      control,
      name: [`${name}.config`, `${name}.responseType`, `${name}.responseValues.paletteName`],
    });

    const [showColorPalette, setShowColorPalette] = useState(!!palette);

    const handleChangeColorPaletteVisibility = (visibility: boolean) => {
      setShowColorPalette(visibility);
      setValue(`${name}.responseValues.paletteName`, undefined);
    };
    // const {
    //   fields: alerts,
    //   append: appendAlert,
    //   remove: removeAlert,
    // } = useFieldArray({
    //   control,
    //   name: 'alerts',
    // });
    const {
      fields: options,
      append: appendOption,
      remove: removeOptions,
      update: updateOptions,
    } = useFieldArray({
      control,
      name: `${name}.responseValues.options`,
    });
    const { append: appendRowOption, remove: removeRowOptions } = useFieldArray({
      control,
      name: `${name}.responseValues.rows`,
    });

    //TODO: add alerts after backend ready
    // const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
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

    const handleAddOption = () =>
      appendOption({
        id: uuidv4(),
        text: '',
        isHidden: false,
        ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
        ...(hasColorPalette &&
          palette && { color: { hex: getPaletteColor(palette, options.length) } as ColorResult }),
      });

    const handleAddRowOption = () =>
      appendRowOption({
        id: uuidv4(),
        rowName: '',
        options: [
          {
            id: uuidv4(),
            text: '',
          },
        ],
      });

    // const handleAddAlert = () =>
    //   appendAlert({
    //     option: '',
    //     item: '',
    //     slider: '',
    //     message: '',
    //     min: '',
    //     max: '',
    //   });

    const handleRemoveOptions = (index: number) => {
      // const options = getValues(`${name}.index`);
      // const { options, alerts } = getValues();
      // const option = options?.[index];
      // if (option) {
      //   setValue(
      //     'alerts',
      //     alerts?.map((alert) => (alert.option === option.id ? { ...alert, option: '' } : alert)),
      //   );
      // }
      removeOptions(index);
    };

    const handleUpdateOption = (index: number, option: SingleAndMultipleSelectionOption) => {
      updateOptions(index, option);
    };

    // const handleRemoveAlert = (index: number) => {
    //   removeAlert(index);
    //   if (!getValues().alerts?.length) {
    //     setValue(
    //       'settings',
    //       settings?.filter(
    //         (settingKey: ItemConfigurationSettings) =>
    //           settingKey !== ItemConfigurationSettings.HasAlerts,
    //       ),
    //     );
    //   }
    // };

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
      removeOptions,
      handleAddOption,
      removeRowOptions,
      handleAddRowOption,
      // removeAlert: () => {}, //TODO: remove after backend ready
      // handleAddAlert: () => {}, //TODO: remove after backend ready
      setShowColorPalette: handleChangeColorPaletteVisibility,
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
                  onClick={() => handleChangeColorPaletteVisibility(true)}
                  variant="outlined"
                  startIcon={<Svg id="paint-outline" width="20" height="20" />}
                >
                  {t('setPalette')}
                </Button>
              )}
            </StyledFlexTopCenter>
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
        {isTextInputOptionVisible && (
          <TextInputOption name={name} onRemove={handleRemoveTextInputOption} />
        )}
        {/* {hasAlerts && (
          <Alerts appendAlert={handleAddAlert} removeAlert={handleRemoveAlert} alerts={alerts} name={name} />
        )} */}
        {settingsDrawerVisible && (
          <ItemSettingsDrawer
            open={settingsDrawerVisible}
            onClose={() => setSettingsDrawerVisible(false)}
          >
            <ItemSettingsController
              name={`${name}.config`}
              inputType={responseType}
              control={control}
            />
          </ItemSettingsDrawer>
        )}
      </>
    );
  },
);
