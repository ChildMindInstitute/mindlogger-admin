// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { CHANGE_DEBOUNCE_VALUE, ItemResponseType, JEST_TEST_TIMEOUT } from 'shared/consts';
import { asyncTimeout, renderWithAppletFormData } from 'shared/utils';

import {
  getAppletFormDataWithItem,
  mockedAlertsTestid,
  mockedItemName,
  mockedTextInputOptionTestid,
  renderItemConfiguration,
  setItemConfigSetting,
  setItemResponseType,
} from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

const getDataTestidRegex = (isSliderRows) =>
  `builder-activity-items-item-configuration-slider${isSliderRows ? '-rows-\\d+' : ''}`;
const renderSlider = (responseType) => {
  const ref = createRef();

  renderWithAppletFormData({
    children: renderItemConfiguration(),
    appletFormData: getAppletFormDataWithItem(),
    formRef: ref,
  });

  setItemResponseType(responseType);

  return ref;
};
const selectSliderId = (panelIndex, sliderIndex) => {
  const sliderSelect = screen.getByTestId(`${mockedAlertsTestid}-${panelIndex}-slider-rows-row`);
  const sliderSelectButton = sliderSelect.querySelector('[role="button"]');
  fireEvent.mouseDown(sliderSelectButton);
  fireEvent.click(
    screen
      .getByTestId(`${mockedAlertsTestid}-${panelIndex}-slider-rows-row-dropdown`)
      .querySelectorAll('li')[sliderIndex],
  );
};
const selectOption = (panelIndex, optionIndex) => {
  const optionSelect = screen.getByTestId(`${mockedAlertsTestid}-${panelIndex}-slider-rows-value`);
  const optionSelectButton = optionSelect.querySelector('[role="button"]');
  fireEvent.mouseDown(optionSelectButton);
  fireEvent.click(
    screen
      .getByTestId(`${mockedAlertsTestid}-${panelIndex}-slider-rows-value-dropdown`)
      .querySelectorAll('li')[optionIndex],
  );
};

describe('ItemConfiguration: Slider & Slider Rows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    responseType                   | description
    ${ItemResponseType.Slider}     | ${'Slider: renders by default with 1 panel'}
    ${ItemResponseType.SliderRows} | ${'Slider rows: renders by default with 2 panels'}
  `('$description', async ({ responseType }) => {
    renderSlider(responseType);

    const isSliderRows = responseType === ItemResponseType.SliderRows;
    const dataTestidRegex = getDataTestidRegex(isSliderRows);

    await waitFor(() => {
      const panels = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-panel`));

      expect(panels).toHaveLength(isSliderRows ? 2 : 1);

      const removeButton = screen.queryByTestId(
        'builder-activity-items-item-configuration-slider-remove',
      );
      isSliderRows ? expect(removeButton).toBeVisible() : expect(removeButton).toBeNull();

      const titles = screen.getAllByTestId(
        'builder-activity-items-item-configuration-slider-title',
      );
      titles.forEach((title, index) => {
        isSliderRows
          ? expect(title).toHaveTextContent(`Slider ${index + 1}`)
          : expect(title).toHaveTextContent('Slider');
      });

      if (isSliderRows) {
        const label = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-label`));

        expect(label[0]).toBeVisible();
      }

      const minLabels = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-min-label`));
      const maxLabels = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-max-label`));
      minLabels.forEach((label) => {
        expect(label).toBeVisible();
        expect(label.querySelector('label')).toHaveTextContent('Left Label');
      });
      maxLabels.forEach((label) => {
        expect(label).toBeVisible();
        expect(label.querySelector('label')).toHaveTextContent('Right Label');
      });

      const sliders = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-slider`));
      sliders.forEach((slider) => {
        expect(slider).toBeVisible();
      });

      const minValues = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-min-value`));
      const maxValues = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-max-value`));
      minValues.forEach((value) => {
        expect(value).toBeVisible();
        expect(value.querySelector('label')).toHaveTextContent('Left Value');
        expect(value.querySelector('input')).toHaveValue(0);
      });
      maxValues.forEach((value) => {
        expect(value).toBeVisible();
        expect(value.querySelector('label')).toHaveTextContent('Right Value');
        expect(value.querySelector('input')).toHaveValue(isSliderRows ? 5 : 12);
      });

      const addButton = screen.queryByTestId(
        'builder-activity-items-item-configuration-slider-add-slider',
      );
      isSliderRows ? expect(addButton).toBeVisible() : expect(addButton).toBeNull();
    });
  });

  test('Slider Rows: slider is added and removed successfully', async () => {
    const ref = renderSlider(ItemResponseType.SliderRows);

    const button = screen.getByTestId(
      'builder-activity-items-item-configuration-slider-add-slider',
    );
    fireEvent.click(button);
    const dataTestidRegex = getDataTestidRegex(true);

    await waitFor(() => {
      const panels = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-panel`));
      expect(panels).toHaveLength(3);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.rows`)).toHaveLength(3);
    });

    const removeButtons = screen.getAllByTestId(
      'builder-activity-items-item-configuration-slider-remove',
    );
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const panels = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-panel`));
      expect(panels).toHaveLength(2);
      expect(ref.current.getValues(`${mockedItemName}.responseValues.rows`)).toHaveLength(2);
    });
  });

  describe('Slider/Slider Rows: sets correct data when changed', () => {
    test.each`
      testId                                                          | attribute     | value          | description
      ${'builder-activity-items-item-configuration-slider-min-label'} | ${'minLabel'} | ${'min label'} | ${'Slider: min label'}
      ${'builder-activity-items-item-configuration-slider-max-label'} | ${'maxLabel'} | ${'max label'} | ${'Slider: max label'}
      ${'builder-activity-items-item-configuration-slider-min-value'} | ${'minValue'} | ${2}           | ${'Slider: min value'}
      ${'builder-activity-items-item-configuration-slider-max-value'} | ${'maxValue'} | ${12}          | ${'Slider: max value'}
    `('$description', ({ testId, attribute, value }) => {
      const ref = renderSlider(ItemResponseType.Slider);

      const input = screen.getByTestId(testId).querySelector('input');
      fireEvent.change(input, { target: { value } });

      expect(ref.current.getValues(`${mockedItemName}.responseValues.${attribute}`)).toEqual(value);
    });

    test.each`
      testId         | attribute     | value          | description
      ${'label'}     | ${'label'}    | ${'label'}     | ${'Slider: min label'}
      ${'min-label'} | ${'minLabel'} | ${'min label'} | ${'Slider: min label'}
      ${'max-label'} | ${'maxLabel'} | ${'max label'} | ${'Slider: max label'}
      ${'min-value'} | ${'minValue'} | ${2}           | ${'Slider: min value'}
      ${'max-value'} | ${'maxValue'} | ${12}          | ${'Slider: max value'}
    `('$description', async ({ testId, attribute, value }) => {
      const ref = renderSlider(ItemResponseType.SliderRows);

      const items = screen.getAllByTestId(new RegExp(`${getDataTestidRegex(true)}-${testId}`));
      items.forEach((item, index) => {
        const input = item.querySelector('input');
        fireEvent.change(input, { target: { value } });

        expect(
          ref.current.getValues(`${mockedItemName}.responseValues.rows.${index}.${attribute}`),
        ).toEqual(value);
      });
    });
  });

  describe('Slider: Alerts', () => {
    test('Is rendered correctly', async () => {
      renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      expect(screen.getByText('Alert 1')).toBeVisible();
      expect(
        screen.getByText('If Respondent selected when answering this question then send:'),
      ).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-remove`)).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-text`));
      expect(
        screen.getByTestId(`${mockedAlertsTestid}-0-slider-value`).querySelector('input'),
      ).toHaveValue(0);
    });

    test('Add/remove works correctly', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
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

    test('Sets correct data when changed', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);

      const alertInput = screen.getByTestId(`${mockedAlertsTestid}-1-text`).querySelector('input');
      fireEvent.change(alertInput, { target: { value: 'text' } });

      await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

      const valueInput = screen
        .getByTestId(`${mockedAlertsTestid}-1-slider-value`)
        .querySelector('input');
      fireEvent.change(valueInput, { target: { value: 4 } });

      expect(ref.current.getValues(`${mockedItemName}.alerts.1`)).toStrictEqual({
        alert: 'text',
        value: 4,
        key: ref.current.getValues(`${mockedItemName}.alerts.1.key`),
      });
    });

    test('Removes alerts if the last Alert was removed', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
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
      message                                | value | attribute         | description
      ${'Alert Message is required'}         | ${''} | ${'text'}         | ${'Validation error: empty message'}
      ${'Select a value within an interval'} | ${-2} | ${'slider-value'} | ${'Validation error: value is not in range'}
    `('$description', async ({ message, value, attribute }) => {
      const ref = renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const input = screen
        .getByTestId(`${mockedAlertsTestid}-0-${attribute}`)
        .querySelector('input');
      fireEvent.change(input, { target: { value } });

      await asyncTimeout(CHANGE_DEBOUNCE_VALUE);
      await ref.current.trigger(`${mockedItemName}.alerts`);

      await waitFor(() => {
        expect(screen.getByText(message)).toBeVisible();
      });
    });
  });

  describe('Slider Rows: Alerts', () => {
    test('Is rendered correctly', async () => {
      renderSlider(ItemResponseType.SliderRows);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      expect(screen.getByText('Alert 1')).toBeVisible();
      expect(
        screen.getByText('If respondent in selected when answering this question then send:'),
      ).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-remove`)).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-text`));
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-slider-rows-row`)).toBeVisible();
      expect(screen.getByTestId(`${mockedAlertsTestid}-0-slider-rows-value`)).toBeVisible();
    });

    test('Sets correct data when changed', async () => {
      const ref = renderSlider(ItemResponseType.SliderRows);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);

      const alertInput = screen.getByTestId(`${mockedAlertsTestid}-1-text`).querySelector('input');
      fireEvent.change(alertInput, { target: { value: 'text' } });

      await asyncTimeout(CHANGE_DEBOUNCE_VALUE);

      selectSliderId(1, 0);
      selectOption(1, 4);

      expect(ref.current.getValues(`${mockedItemName}.alerts.1`)).toStrictEqual({
        alert: 'text',
        value: '4',
        sliderId: ref.current.getValues(`${mockedItemName}.responseValues.rows.0.id`),
        key: ref.current.getValues(`${mockedItemName}.alerts.1.key`),
      });
    });

    test('Options in list are filtered if already used', async () => {
      renderSlider(ItemResponseType.SliderRows);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      const addAlert = screen.getByTestId('builder-activity-items-item-configuration-add-alert');
      fireEvent.click(addAlert);

      const optionSelect = screen.getByTestId(`${mockedAlertsTestid}-1-slider-rows-value`);
      const optionSelectButton = optionSelect.querySelector('[role="button"]');

      selectSliderId(0, 0);
      selectSliderId(1, 0);

      fireEvent.mouseDown(optionSelectButton);
      expect(
        screen
          .getByTestId(`${mockedAlertsTestid}-1-slider-rows-value-dropdown`)
          .querySelectorAll('li'),
      ).toHaveLength(6);

      selectOption(0, 0);

      fireEvent.mouseDown(optionSelectButton);
      expect(
        [
          ...screen
            .getByTestId(`${mockedAlertsTestid}-1-slider-rows-value-dropdown`)
            .querySelectorAll('li'),
        ].filter((li) => !li.classList.contains('hidden-menu-item')),
      ).toHaveLength(5);
    });

    test.each`
      testId                                         | message                        | description
      ${`${mockedAlertsTestid}-0-slider-rows-row`}   | ${''}                          | ${'Validation error: empty Slider'}
      ${`${mockedAlertsTestid}-0-slider-rows-value`} | ${''}                          | ${'Validation error: empty Option'}
      ${`${mockedAlertsTestid}-0-text`}              | ${'Alert Message is required'} | ${'Validation error: empty Alert'}
    `('$description', async ({ testId, message }) => {
      const ref = renderSlider(ItemResponseType.SliderRows);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      await ref.current.trigger(`${mockedItemName}.alerts`);

      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeVisible();
        expect(screen.getByTestId(testId).querySelector('div')).toHaveClass('Mui-error');

        message && expect(screen.getByTestId(testId)).toBeVisible();
      });
    });
  });

  describe('Slider: Is Continuous + Alerts', () => {
    test('Sets correct data when changed', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.IsContinuous);
      await setItemConfigSetting(ItemConfigurationSettings.HasAlerts);

      expect(ref.current.getValues(`${mockedItemName}.alerts.0`)).toStrictEqual({
        minValue: 0,
        maxValue: 12,
        alert: '',
        key: ref.current.getValues(`${mockedItemName}.alerts.0.key`),
      });

      const minValue = screen
        .getByTestId(`${mockedAlertsTestid}-0-cont-slider-min-value`)
        .querySelector('input');
      const maxValue = screen
        .getByTestId(`${mockedAlertsTestid}-0-cont-slider-max-value`)
        .querySelector('input');

      fireEvent.change(minValue, { target: { value: -7 } });
      fireEvent.change(maxValue, { target: { value: 50 } });

      expect(ref.current.getValues(`${mockedItemName}.alerts.0`)).toStrictEqual({
        minValue: -7,
        maxValue: 50,
        alert: '',
        key: ref.current.getValues(`${mockedItemName}.alerts.0.key`),
      });
    });
  });

  describe('Slider: Scores', () => {
    test('Sets correct data when changed', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      const cell = screen.getByTestId(
        'builder-activity-items-item-configuration-slider-scores-table-0-score-inactive',
      );
      fireEvent.click(cell);

      fireEvent.change(
        screen
          .getByTestId('builder-activity-items-item-configuration-slider-scores-table-0-score')
          .querySelector('input'),
        { target: { value: 15 } },
      );

      expect(ref.current.getValues(`${mockedItemName}.responseValues.scores`)).toEqual([
        15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      ]);
    });

    test('Is removed from document when checkbox is unchecked', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      expect(
        screen.getByTestId(
          'builder-activity-items-item-configuration-slider-scores-table-0-score-inactive',
        ),
      ).toBeVisible();

      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      expect(
        screen.queryByTestId(
          'builder-activity-items-item-configuration-slider-scores-table-0-score-inactive',
        ),
      ).not.toBeInTheDocument();
      expect(ref.current.getValues(`${mockedItemName}.responseValues.scores`)).toBeUndefined();
    });

    test('Validation errors:', async () => {
      const ref = renderSlider(ItemResponseType.Slider);
      await setItemConfigSetting(ItemConfigurationSettings.HasScores);

      const cell = screen.getByTestId(
        'builder-activity-items-item-configuration-slider-scores-table-0-score-inactive',
      );
      fireEvent.click(cell);

      fireEvent.change(
        screen
          .getByTestId('builder-activity-items-item-configuration-slider-scores-table-0-score')
          .querySelector('input'),
        { target: { value: '' } },
      );

      await ref.current.trigger(`${mockedItemName}.responseValues.scores`);

      await waitFor(() => {
        expect(screen.getByText('Numerical value is required')).toBeVisible();
      });

      fireEvent.change(
        screen
          .getByTestId('builder-activity-items-item-configuration-slider-scores-table-0-score')
          .querySelector('input'),
        { target: { value: 5 } },
      );

      await ref.current.trigger(`${mockedItemName}.responseValues.scores`);

      await waitFor(() => {
        expect(screen.queryByText('Numerical value is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Slider: Additional Response Options', () => {
    test('Is rendered correctly when Add Text Input Option is selected', async () => {
      renderSlider(ItemResponseType.Slider);

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
      renderSlider(ItemResponseType.Slider);

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
      const ref = renderSlider(ItemResponseType.Slider);

      await setItemConfigSetting(ItemConfigurationSettings.HasTextInput);

      const removeButton = screen.getByTestId(`${mockedTextInputOptionTestid}-remove`);
      fireEvent.click(removeButton);

      expect(screen.queryByTestId(mockedTextInputOptionTestid)).not.toBeInTheDocument();
      expect(
        ref.current.getValues(`${mockedItemName}.config.additionalResponseOption.textInputOption`),
      ).toBeFalsy();
    });
  });

  test.each`
    responseType                   | testId                                                             | value | message                       | description
    ${ItemResponseType.Slider}     | ${'builder-activity-items-item-configuration-slider-min-value'}    | ${-1} | ${'Select valid interval'}    | ${'Slider: Validation error: Min value less than 0'}
    ${ItemResponseType.Slider}     | ${'builder-activity-items-item-configuration-slider-max-value'}    | ${13} | ${'Select valid interval'}    | ${'Slider: Validation error: Max value more than 12'}
    ${ItemResponseType.SliderRows} | ${'builder-activity-items-item-configuration-slider-rows-0-label'} | ${''} | ${'Slider Label is required'} | ${'Slider Rows: Validation error: Empty Label'}
  `('$description', async ({ responseType, testId, value, message }) => {
    const ref = renderSlider(responseType);

    fireEvent.change(screen.getByTestId(testId).querySelector('input'), { target: { value } });

    await ref.current.trigger(`${mockedItemName}.responseValues`);
    await waitFor(() => {
      expect(screen.getAllByText(message)[0]).toBeVisible();
    });
  });

  test.each`
    setting                                         | description
    ${ItemConfigurationSettings.HasTickMarks}       | ${'Slider: Show Tick Marks'}
    ${ItemConfigurationSettings.HasTickMarksLabels} | ${'Slider: Show Tick Marks Labels'}
  `(
    '$description',
    async ({ setting }) => {
      renderSlider(ItemResponseType.Slider);

      const isMarks = setting === ItemConfigurationSettings.HasTickMarks;

      if (!isMarks) await setItemConfigSetting(ItemConfigurationSettings.HasTickMarks);
      await setItemConfigSetting(setting);

      await waitFor(() => {
        const slider = screen.getByTestId(new RegExp(`${getDataTestidRegex(false)}-slider`));

        const expected = slider.querySelectorAll(
          isMarks ? '.MuiSlider-mark' : '.MuiSlider-markLabel',
        );
        expect(expected).toHaveLength(13);
      });
    },
    JEST_TEST_TIMEOUT,
  );
});
