// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { CHANGE_DEBOUNCE_VALUE, ItemResponseType } from 'shared/consts';
import { asyncTimeout, renderWithAppletFormData } from 'shared/utils';

import {
  getAppletFormDataWithItem,
  mockedAlertsTestid,
  mockedItemName,
  mockedUseParams,
  renderItemConfiguration,
  setItemConfigSetting,
  setItemResponseType,
} from '../__mocks__';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

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
        expect(label.querySelector('label')).toHaveTextContent('Min Label');
      });
      maxLabels.forEach((label) => {
        expect(label).toBeVisible();
        expect(label.querySelector('label')).toHaveTextContent('Max Label');
      });

      const sliders = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-slider`));
      sliders.forEach((slider) => {
        expect(slider).toBeVisible();
      });

      const minValues = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-min-value`));
      const maxValues = screen.getAllByTestId(new RegExp(`${dataTestidRegex}-max-value`));
      minValues.forEach((value) => {
        expect(value).toBeVisible();
        expect(value.querySelector('label')).toHaveTextContent('Min Value');
        expect(value.querySelector('input')).toHaveValue(isSliderRows ? 1 : 0);
      });
      maxValues.forEach((value) => {
        expect(value).toBeVisible();
        expect(value.querySelector('label')).toHaveTextContent('Max Value');
        expect(value.querySelector('input')).toHaveValue(5);
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

      const sliderSelect = screen.getByTestId(`${mockedAlertsTestid}-1-slider-rows-row`);
      const sliderSelectButton = sliderSelect.querySelector('[role="button"]');
      fireEvent.mouseDown(sliderSelectButton);
      fireEvent.click(
        screen.getByTestId(`${mockedAlertsTestid}-1-slider-rows-row-dropdown`).querySelector('li'),
      );

      const optionSelect = screen.getByTestId(`${mockedAlertsTestid}-1-slider-rows-value`);
      const optionSelectButton = optionSelect.querySelector('[role="button"]');
      fireEvent.mouseDown(optionSelectButton);
      fireEvent.click(
        screen
          .getByTestId(`${mockedAlertsTestid}-1-slider-rows-value-dropdown`)
          .querySelector('li:last-child'),
      );

      expect(ref.current.getValues(`${mockedItemName}.alerts.1`)).toStrictEqual({
        alert: 'text',
        value: '5',
        sliderId: ref.current.getValues(`${mockedItemName}.responseValues.rows.0.id`),
        key: ref.current.getValues(`${mockedItemName}.alerts.1.key`),
      });
    });

    test('Options in list are filtered if already used', async () => {});

    test('validations', () => {});
  });

  describe('Slider: Is Continuous + Alerts', () => {
    test('Sets correct data when changed', async () => {});
  });
  describe('Slider: Scores', () => {
    test('Sets correct data when changed', async () => {});
    test('Is removed from document when checkbox is unchecked', async () => {});
    test('validation', () => {});
  });
  describe('Slider: Additional Response Options', () => {
    test('Is rendered correctly when Add Text Input Option is selected', async () => {});
    test('Is rendered correctly when Required is selected additionally', async () => {});
    test('Is removed when click on Trash icon', async () => {});
  });

  test('Slider/Slider Rows: Validation', () => {});

  test.each`
    setting                                         | description
    ${ItemConfigurationSettings.HasTickMarks}       | ${'Slider: Show Tick Marks'}
    ${ItemConfigurationSettings.HasTickMarksLabels} | ${'Slider: Show Tick Marks Labels'}
  `('$description', async ({ setting }) => {
    renderSlider(ItemResponseType.Slider);

    const isMarks = setting === ItemConfigurationSettings.HasTickMarks;

    if (!isMarks) await setItemConfigSetting(ItemConfigurationSettings.HasTickMarks);
    await setItemConfigSetting(setting);

    await waitFor(() => {
      const slider = screen.getByTestId(new RegExp(`${getDataTestidRegex(false)}-slider`));

      const expected = slider.querySelectorAll(
        isMarks ? '.MuiSlider-mark' : '.MuiSlider-markLabel',
      );
      expect(expected).toHaveLength(6);
    });
  });
});
