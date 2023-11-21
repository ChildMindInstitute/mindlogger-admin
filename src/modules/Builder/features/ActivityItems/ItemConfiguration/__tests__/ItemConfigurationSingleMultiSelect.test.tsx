// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import get from 'lodash.get';

import { mockedAppletFormData } from 'shared/mock';
import { ItemResponseType } from 'shared/consts';
import { createArray, renderWithAppletFormData } from 'shared/utils';

import {
  mockedItemName,
  mockedSingleAndMultiSelectOptionTestid,
  mockedPalette1Color,
  renderItemConfiguration,
  getAppletFormDataWithItem,
  setItemResponseType,
  setItemConfigSetting,
  getAppletFormDataWithItemWithPalette,
} from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    appletId: mockedAppletFormData.id,
    activityId: mockedAppletFormData.activities[0].id,
  }),
}));

const mockedChangeColorEvent = { hex: '#fff' };
jest.mock('react-color', () => ({
  ChromePicker: ({ onChangeComplete }) => (
    <div
      data-testid={'color-picker'}
      onClick={() => onChangeComplete(mockedChangeColorEvent)}
    ></div>
  ),
}));

describe('ItemConfiguration: Single Selection & Multiple Selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    responseType                          | description
    ${ItemResponseType.SingleSelection}   | ${'Single: by default renders with 1 option'}
    ${ItemResponseType.MultipleSelection} | ${'Multiple: by default renders with 1 option'}
  `('$description', async ({ responseType }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(responseType);

    await waitFor(() => {
      const options = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-options-\d+-option$/,
      );
      expect(options).toHaveLength(1);

      const hideButton = screen.getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-hide`);
      expect(hideButton).toBeVisible();
      expect(hideButton.querySelector('svg')).toHaveClass('svg-visibility-on');

      expect(
        screen.getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-title`),
      ).toHaveTextContent('Option 1');
      expect(screen.getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-image`)).toBeVisible();

      const text = screen.getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-text`);
      expect(text).toBeVisible();
      expect(text.querySelector('label')).toHaveTextContent('Option Text');

      const addOption = screen.getByTestId('builder-activity-items-item-configuration-add-option');
      expect(addOption).toBeVisible();
      expect(addOption).toHaveTextContent('Add Option');
    });
  });

  test.each`
    responseType                          | description
    ${ItemResponseType.SingleSelection}   | ${'Single: option is added and removed successfully'}
    ${ItemResponseType.MultipleSelection} | ${'Multi: option is added and removed successfully'}
  `('$description', async ({ responseType }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(responseType);

    const button = screen.getByTestId('builder-activity-items-item-configuration-add-option');
    fireEvent.click(button);

    await waitFor(() => {
      const options = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-options-\d+-option$/,
      );
      expect(options).toHaveLength(2);

      options.forEach((_, index) => {
        expect(
          screen.getByTestId(`builder-activity-items-item-configuration-options-${index}-remove`),
        ).toBeVisible();
      });

      const secondOption = screen.getByTestId(
        'builder-activity-items-item-configuration-options-1-title',
      );
      expect(secondOption).toHaveTextContent('Option 2');
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(2);
    });

    const removeButton = screen.getByTestId(
      'builder-activity-items-item-configuration-options-1-remove',
    );
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(
        screen.getAllByTestId(/^builder-activity-items-item-configuration-options-\d+-option$/),
      ).toHaveLength(1);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(1);
    });
  });

  test.each`
    setting                                      | expected                                                         | removable                                                               | description
    ${ItemConfigurationSettings.HasTooltips}     | ${'builder-activity-items-item-configuration-options-0-tooltip'} | ${''}                                                                   | ${'Add Tooltips adds Tooltip input'}
    ${ItemConfigurationSettings.HasScores}       | ${'builder-activity-items-item-configuration-options-0-score'}   | ${''}                                                                   | ${'Add Scores adds Score input'}
    ${ItemConfigurationSettings.HasColorPalette} | ${'builder-activity-items-item-configuration-set-color-palette'} | ${''}                                                                   | ${'Set Color Palette add Set Palette button'}
    ${ItemConfigurationSettings.HasAlerts}       | ${'builder-activity-items-item-configuration-alerts-0-panel'}    | ${'builder-activity-items-item-configuration-alerts-0-remove'}          | ${'Set Alerts adds Alert panel (and sets appropriate setting to false if remove is clicked)'}
    ${ItemConfigurationSettings.HasTextInput}    | ${'builder-activity-items-item-configuration-text-input-option'} | ${'builder-activity-items-item-configuration-text-input-option-remove'} | ${'Add Text Input Option adds Additional Text Input Option panel (and sets appropriate setting to false if remove is clicked)'}
  `('$description', async ({ setting, expected, removable }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.SingleSelection);

    await setItemConfigSetting(setting);

    await waitFor(() => {
      expect(screen.getByTestId(expected)).toBeVisible();
    });

    if (removable) {
      const removeButton = screen.getByTestId(removable);
      fireEvent.click(removeButton);

      expect(screen.queryByTestId(expected)).not.toBeInTheDocument();

      const config = ref.current.getValues(`${mockedItemName}.config`);
      expect(get(config, setting)).toBeFalsy();
    }
  });

  describe('Color Palette:', () => {
    test('Add/Remove works correctly', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(),
        formRef: ref,
      });

      setItemResponseType(ItemResponseType.SingleSelection);

      const addOption = screen.getByTestId('builder-activity-items-item-configuration-add-option');

      createArray(9, () => fireEvent.click(addOption));

      const options = screen.getAllByTestId(
        /^builder-activity-items-item-configuration-options-\d+-option$/,
      );

      await setItemConfigSetting(ItemConfigurationSettings.HasColorPalette);

      const paletteButton = screen.getByTestId(
        'builder-activity-items-item-configuration-set-color-palette',
      );
      fireEvent.click(paletteButton);

      const paletteContainer = screen.getByTestId(
        'builder-activity-items-item-configuration-color-palette',
      );
      expect(paletteContainer).toBeVisible();

      options.forEach((_, index) => {
        expect(
          ref.current.getValues(`${mockedItemName}.responseValues.options.${index}.color`),
        ).toStrictEqual({ hex: '' });
      });

      const palette1 = screen.getByTestId(
        'builder-activity-items-item-configuration-color-palette-picker-0',
      );
      fireEvent.click(palette1);

      options.forEach((option, index) => {
        const color = mockedPalette1Color[index % mockedPalette1Color.length];
        expect(
          ref.current.getValues(`${mockedItemName}.responseValues.options.${index}.color`),
        ).toEqual({ hex: color });
      });

      expect(ref.current.getValues(`${mockedItemName}.responseValues.paletteName`)).toEqual(
        'palette1',
      );

      const removePalette = screen.getByTestId(
        'builder-activity-items-item-configuration-color-palette-remove',
      );
      fireEvent.click(removePalette);

      options.forEach((_, index) => {
        const color = mockedPalette1Color[index % mockedPalette1Color.length];
        expect(
          ref.current.getValues(`${mockedItemName}.responseValues.options.${index}.color`),
        ).toEqual({ hex: color });
      });

      expect(
        screen.queryByTestId('builder-activity-items-item-configuration-color-palette'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('builder-activity-items-item-configuration-set-color-palette'),
      ).toBeVisible();
      expect(ref.current.getValues(`${mockedItemName}.responseValues.paletteName`)).toBeUndefined();
    });

    test('Is initialized correctly for item with paletteName', () => {
      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItemWithPalette('palette2'),
      });

      expect(
        screen.getByTestId('builder-activity-items-item-configuration-color-palette'),
      ).toBeVisible();

      const palette2 = screen.getByTestId(
        'builder-activity-items-item-configuration-color-palette-picker-1',
      );
      expect(palette2.querySelector('input')).toBeChecked();
    });

    test('Is initialized correctly for item with Set Palette Color checked and without paletteName', () => {
      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItemWithPalette(),
      });

      expect(
        screen.queryByTestId('builder-activity-items-item-configuration-color-palette'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('builder-activity-items-item-configuration-set-color-palette'),
      ).toBeVisible();
    });

    test('Value for paletteName is removed if palette is already selected and color for option is changed', async () => {
      const ref = createRef();

      const container = renderWithAppletFormData({
        children: renderItemConfiguration(),
        formRef: ref,
        appletFormData: getAppletFormDataWithItemWithPalette('palette2'),
      });

      const colorPickerButton = screen.getByTestId(
        'builder-activity-items-item-configuration-options-0-palette',
      );
      fireEvent.click(colorPickerButton);

      const colorPicker = screen.getByTestId('color-picker');
      fireEvent.click(colorPicker);

      expect(
        ref.current.getValues(`${mockedItemName}.responseValues.options.0.color`),
      ).toStrictEqual(mockedChangeColorEvent);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.paletteName`)).toEqual('');
    });
  });
});
