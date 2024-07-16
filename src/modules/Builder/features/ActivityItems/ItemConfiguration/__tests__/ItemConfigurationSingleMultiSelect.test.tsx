// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import get from 'lodash.get';
import userEvent from '@testing-library/user-event';

import { mockedMultiSelectFormValues, mockedSingleSelectFormValues } from 'shared/mock';
import { CHANGE_DEBOUNCE_VALUE, ItemResponseType, JEST_TEST_TIMEOUT } from 'shared/consts';
import { asyncTimeout, createArray } from 'shared/utils';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';

import {
  mockedItemName,
  mockedSingleAndMultiSelectOptionTestid,
  mockedPalette1Color,
  renderItemConfiguration,
  getAppletFormDataWithItem,
  setItemResponseType,
  setItemConfigSetting,
  getAppletFormDataWithItemWithPalette,
  mockedTextInputOptionTestid,
  mockedAlertsTestid,
} from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

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

  test('should not render Add None Option for Single Selection', () => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.SingleSelection);

    const addNoneOption = screen.queryByTestId(
      'builder-activity-items-item-configuration-add-none-option',
    );
    expect(addNoneOption).toBeNull();
  });

  test('should render Add None Option for Multi Selection', () => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.MultipleSelection);

    const addNoneOption = screen.getByTestId(
      'builder-activity-items-item-configuration-add-none-option',
    );
    expect(addNoneOption).toBeVisible();
    expect(addNoneOption).toHaveTextContent('Add “None“ Option');
  });

  test('should render only one None option for Multi Selection', async () => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.MultipleSelection);

    expect(
      screen.getAllByTestId(/^builder-activity-items-item-configuration-options-\d+-option$/),
    ).toHaveLength(1);
    expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(1);

    const addNoneOption = screen.getByTestId(
      'builder-activity-items-item-configuration-add-none-option',
    );
    fireEvent.click(addNoneOption);

    await waitFor(() => {
      expect(addNoneOption).toBeDisabled();
      expect(
        screen.getAllByTestId(/^builder-activity-items-item-configuration-options-\d+-option$/),
      ).toHaveLength(2);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(2);
      const secondOption = screen.getByTestId(
        'builder-activity-items-item-configuration-options-1-title',
      );
      expect(secondOption).toHaveTextContent('“None“ Option');
    });

    const removeNoneOptionButton = screen.getByTestId(
      'builder-activity-items-item-configuration-options-1-remove',
    );
    fireEvent.click(removeNoneOptionButton);

    await waitFor(() => {
      expect(addNoneOption).toBeEnabled();
    });
  });

  test('should keep the ordering for None option and the indexing for next Options for Multi Selection', async () => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.MultipleSelection);

    expect(
      screen.getAllByTestId(/^builder-activity-items-item-configuration-options-\d+-option$/),
    ).toHaveLength(1);
    expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(1);
    const secondOption = screen.getByTestId(
      'builder-activity-items-item-configuration-options-0-title',
    );
    expect(secondOption).toHaveTextContent('Option 1');

    const addNoneOption = screen.getByTestId(
      'builder-activity-items-item-configuration-add-none-option',
    );
    fireEvent.click(addNoneOption);

    await waitFor(() => {
      expect(
        screen.getAllByTestId(/^builder-activity-items-item-configuration-options-\d+-option$/),
      ).toHaveLength(2);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(2);
      const secondOption = screen.getByTestId(
        'builder-activity-items-item-configuration-options-1-title',
      );
      expect(secondOption).toHaveTextContent('“None“ Option');
    });

    const addOption = screen.getByTestId('builder-activity-items-item-configuration-add-option');
    fireEvent.click(addOption);

    await waitFor(() => {
      expect(
        screen.getAllByTestId(/^builder-activity-items-item-configuration-options-\d+-option$/),
      ).toHaveLength(3);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options`)).toHaveLength(3);
      const thirdOption = screen.getByTestId(
        'builder-activity-items-item-configuration-options-2-title',
      );
      expect(thirdOption).toHaveTextContent('Option 2');
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

  test('Validation message is visible if Option Text is empty', async () => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.SingleSelection);

    await ref.current.trigger(`${mockedItemName}.responseValues.options.0`);

    await waitFor(() => {
      expect(screen.getByText('Option Text is required')).toBeVisible();
    });
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
        expect(
          ref.current.getValues(`${mockedItemName}.responseValues.options.${index}.color`),
        ).toEqual({ hex: '' });
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

      renderWithAppletFormData({
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

  describe('Additional Response Options:', () => {
    test('Is rendered correctly when Add Text Input Option is selected', async () => {
      renderWithAppletFormData({
        children: renderItemConfiguration(),
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasTextInput);

      expect(screen.getByTestId(mockedTextInputOptionTestid)).toBeVisible();
      expect(screen.getByTestId(`${mockedTextInputOptionTestid}-title`)).toHaveTextContent(
        'Additional Text Input Option',
      );
      expect(screen.getByTestId(`${mockedTextInputOptionTestid}-remove`)).toBeVisible();
      expect(screen.getByTestId(`${mockedTextInputOptionTestid}-description`)).toHaveTextContent(
        'The respondent will be able to enter an additional text response',
      );
    });

    test('Is rendered correctly when Required is selected additionally', async () => {
      renderWithAppletFormData({
        children: renderItemConfiguration(),
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasTextInput);
      await setItemConfigSetting(ItemConfigurationSettings.IsTextInputRequired);

      expect(screen.getByTestId(`${mockedTextInputOptionTestid}-title`)).toHaveTextContent(
        'Additional Text Input Option (Required)',
      );
      expect(screen.getByTestId(`${mockedTextInputOptionTestid}-description`)).toHaveTextContent(
        'The respondent will be required to enter an additional text response',
      );
      expect(
        screen.getByTestId(
          'builder-activity-items-item-configuration-text-input-option-description-required',
        ),
      ).toHaveTextContent('*Required');
    });

    test('Is removed when click on Trash icon', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasTextInput);

      const removeButton = screen.getByTestId(`${mockedTextInputOptionTestid}-remove`);
      fireEvent.click(removeButton);

      expect(screen.queryByTestId(mockedTextInputOptionTestid)).not.toBeInTheDocument();
      expect(
        ref.current.getValues(`${mockedItemName}.config.additionalResponseOption.textInputOption`),
      ).toBeFalsy();
    });
  });

  describe('Add Tooltips:', () => {
    test('Sets correct data when changed', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasTooltips);

      const tooltipInput = screen
        .getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-tooltip`)
        .querySelector('input');
      fireEvent.change(tooltipInput, { target: { value: 'tooltip' } });

      await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

      expect(ref.current.getValues(`${mockedItemName}.responseValues.options.0.tooltip`)).toEqual(
        'tooltip',
      );
    });

    test('Is removed from document if checkbox is unchecked', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasTooltips);

      expect(screen.getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-tooltip`)).toBeVisible();

      await setItemConfigSetting(ItemConfigurationSettings.HasTooltips);

      expect(
        screen.queryByTestId(`${mockedSingleAndMultiSelectOptionTestid}-tooltip`),
      ).not.toBeInTheDocument();
    });
  });

  describe('Add Scores:', () => {
    test('Sets correct data when changed', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedMultiSelectFormValues),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      const scoreInput = screen
        .getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-score`)
        .querySelector('input');
      expect(scoreInput).toHaveValue(0);

      fireEvent.change(scoreInput, { target: { value: 13 } });
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options.0.score`)).toEqual(13);

      fireEvent.change(scoreInput, { target: { value: -5 } });
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options.0.score`)).toEqual(-5);

      fireEvent.change(scoreInput, { target: { value: 0.4 } });
      expect(ref.current.getValues(`${mockedItemName}.responseValues.options.0.score`)).toEqual(
        0.4,
      );
    });

    test('Is removed from document when checkbox is unchecked', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedMultiSelectFormValues),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      const scoreInput = screen
        .getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-score`)
        .querySelector('input');
      fireEvent.change(scoreInput, { target: { value: 13 } });

      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      expect(
        ref.current.getValues(`${mockedItemName}.responseValues.options.0.score`),
      ).toBeUndefined();
      expect(
        screen.queryByTestId(`${mockedSingleAndMultiSelectOptionTestid}-score`),
      ).not.toBeInTheDocument();
    });
  });

  describe('Set Alerts:', () => {
    test('Is rendered correctly', async () => {
      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedMultiSelectFormValues),
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      expect(screen.getByText('Alert 1')).toBeVisible();
      expect(
        screen.getByText('If Respondent selected when answering this question then send:'),
      ).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-text`)).toHaveTextContent('Alert Message');
    });

    test('Add/remove works correctly', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedMultiSelectFormValues),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);

      expect(screen.getByTestId(`${mockedAlertsTestid}-1-panel`)).toBeVisible();
      expect(ref.current.getValues(`${mockedItemName}.alerts.1.alert`)).toEqual('');

      const removeAlert = screen.getByTestId(`${mockedAlertsTestid}-0-remove`);
      fireEvent.click(removeAlert);

      expect(screen.queryByTestId(`${mockedAlertsTestid}-1-panel`)).not.toBeInTheDocument();
      expect(ref.current.getValues(`${mockedItemName}.alerts.1`)).toBeUndefined();
    });

    test(
      'Sets correct data when changed',
      async () => {
        const ref = createRef();

        renderWithAppletFormData({
          children: renderItemConfiguration(),
          appletFormData: getAppletFormDataWithItem(mockedMultiSelectFormValues),
          formRef: ref,
        });

        await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

        const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
        fireEvent.click(addAlert);

        const alertInput = screen
          .getByTestId(`${mockedAlertsTestid}-1-text`)
          .querySelector('input');
        fireEvent.change(alertInput, { target: { value: 'text' } });

        await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

        const optionsSelect = screen.getByTestId(`${mockedAlertsTestid}-1-selection-option`);
        const optionsSelectButton = optionsSelect.querySelector('[role="button"]');
        fireEvent.mouseDown(optionsSelectButton);

        const option = screen
          .getByTestId(`${mockedAlertsTestid}-1-selection-option-dropdown`)
          .querySelector('li');
        fireEvent.click(option);

        expect(ref.current.getValues(`${mockedItemName}.alerts.1`)).toStrictEqual({
          alert: 'text',
          value: mockedMultiSelectFormValues.responseValues.options[0].id,
          key: ref.current.getValues(`${mockedItemName}.alerts.1.key`),
        });
      },
      JEST_TEST_TIMEOUT,
    );

    test('Options in list are filtered if already used', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedSingleSelectFormValues),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);
      fireEvent.click(addAlert);

      const alert1OptionsSelect = screen.getByTestId(`${mockedAlertsTestid}-0-selection-option`);
      const alert1OptionsSelectButton = alert1OptionsSelect.querySelector('[role="button"]');
      fireEvent.mouseDown(alert1OptionsSelectButton);

      const alert1Options = screen
        .getByTestId(`${mockedAlertsTestid}-0-selection-option-dropdown`)
        .querySelectorAll('li');
      expect(alert1Options).toHaveLength(2);
      fireEvent.click(alert1Options[0]);

      const alert2OptionsSelect = screen.getByTestId(`${mockedAlertsTestid}-1-selection-option`);
      const alert2OptionsSelectButton = alert2OptionsSelect.querySelector('[role="button"]');
      fireEvent.mouseDown(alert2OptionsSelectButton);

      const alert2Options = screen
        .getByTestId(`${mockedAlertsTestid}-1-selection-option-dropdown`)
        .querySelectorAll('li');
      expect(alert2Options).toHaveLength(1);
      fireEvent.click(alert2Options[0]);

      const alert3OptionsSelect = screen.getByTestId(`${mockedAlertsTestid}-2-selection-option`);
      const alert3OptionsSelectButton = alert3OptionsSelect.querySelector('[role="button"]');
      fireEvent.mouseDown(alert3OptionsSelectButton);

      const alert3Options = screen
        .getByTestId(`${mockedAlertsTestid}-2-selection-option-dropdown`)
        .querySelectorAll('li');
      expect(alert3Options).toHaveLength(0);
    });

    test('Removes alerts if the last Alert was removed', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedSingleSelectFormValues),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const removeAlert = screen.getByTestId(`${mockedAlertsTestid}-0-remove`);
      fireEvent.click(removeAlert);

      expect(screen.queryByTestId(`${mockedAlertsTestid}-0-panel`)).not.toBeInTheDocument();
      expect(
        ref.current.getValues(`${mockedItemName}.config.${ItemConfigurationSettings.HasAlerts}`),
      ).toBeFalsy();
      expect(ref.current.getValues(`${mockedItemName}.alerts`)).toEqual([]);
    });

    test.each`
      message                        | attribute  | description
      ${'Alert Message is required'} | ${'alert'} | ${'Validation error: empty message'}
      ${''}                          | ${'value'} | ${'Validation error: empty option'}
    `('$description', async ({ message, attribute }) => {
      const ref = createRef();

      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedSingleSelectFormValues),
        formRef: ref,
      });

      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);
      await ref.current.trigger(`${mockedItemName}.alerts.0.${attribute}`);

      await waitFor(() => {
        if (message) expect(screen.getByText(message)).toBeVisible();
      });

      const { error } = ref.current.getFieldState(`${mockedItemName}.alerts.0.${attribute}`);
      expect(error.type).toEqual('required');
    });
  });

  describe('Use Portrait Layout Setting', () => {
    test('Lower characters limit with Portrait Layout setting', async () => {
      renderWithAppletFormData({
        children: renderItemConfiguration(),
        appletFormData: getAppletFormDataWithItem(mockedSingleSelectFormValues),
      });

      //character recommendation is set to 75 chars
      expect(screen.getByText('2/75 characters')).toBeInTheDocument();
      expect(screen.getByText('9/75 characters')).toBeInTheDocument();

      await setItemConfigSetting(ItemConfigurationSettings.PortraitLayout);

      //character recommendation is set to 75 chars
      expect(screen.getByText('2/24 characters')).toBeInTheDocument();
      expect(screen.getByText('9/24 characters')).toBeInTheDocument();
      expect(screen.queryByText('Visibility decreases over 24 characters')).not.toBeInTheDocument();

      const optionTextInput = screen
        .getByTestId(`${mockedSingleAndMultiSelectOptionTestid}-text`)
        .querySelector('input');

      //set text input value to 30 chars
      await userEvent.type(
        optionTextInput,
        'Praesent in mauris eu tortor porttitor accumsan. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus. Aenean fermentum risus id tortor. Integer',
      );

      //24 character recommendation warning is visible
      await waitFor(() => {
        expect(screen.getByText('Visibility decreases over 24 characters')).toBeInTheDocument();
      });
    });
  });
});
