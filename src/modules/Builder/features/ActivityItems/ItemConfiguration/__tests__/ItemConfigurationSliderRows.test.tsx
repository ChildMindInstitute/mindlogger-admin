// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { ItemResponseType } from 'shared/consts';
import { renderWithAppletFormData } from 'shared/utils';

import {
  getAppletFormDataWithItem,
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

describe('ItemConfiguration: Slider & Slider Rows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each`
    responseType                   | description
    ${ItemResponseType.Slider}     | ${'Slider: renders by default with 1 panel'}
    ${ItemResponseType.SliderRows} | ${'Slider rows: renders by default with 2 panels'}
  `('$description', async ({ responseType }) => {
    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
    });

    setItemResponseType(responseType);

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
      minLabels.forEach((label, index) => {
        expect(label).toBeVisible();
        expect(label.querySelector('label')).toHaveTextContent('Min Label');
      });
      maxLabels.forEach((label, index) => {
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
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.SliderRows);

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

  test('Slider Rows: Alerts', async () => {});

  test('Slider: Alerts', async () => {});

  test('Slider: Scores', async () => {});
  test('Slider: Use Continuous Slider + Scores', async () => {});

  test.each`
    setting                                         | description
    ${ItemConfigurationSettings.HasTickMarks}       | ${'Slider: Show Tick Marks'}
    ${ItemConfigurationSettings.HasTickMarksLabels} | ${'Slider: Show Tick Marks Labels'}
  `('$description', async ({ setting }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: renderItemConfiguration(),
      appletFormData: getAppletFormDataWithItem(),
      formRef: ref,
    });

    setItemResponseType(ItemResponseType.Slider);

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
