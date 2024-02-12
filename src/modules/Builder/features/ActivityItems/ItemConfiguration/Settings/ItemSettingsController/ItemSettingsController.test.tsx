// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';

import { screen, fireEvent } from '@testing-library/react';
import get from 'lodash.get';
import { v4 as uuidv4 } from 'uuid';

import { renderWithAppletFormData } from 'shared/utils';
import { ItemResponseType } from 'shared/consts';
import {
  mockedAppletFormData,
  mockedAudioPlayerFormValues,
  mockedDrawingFormValues,
  mockedSingleSelectFormValues,
  mockedSingleSelectPerRowFormValues,
  mockedSliderFormValues,
  mockedSliderRowsFormValues,
  mockedTextFormValues,
} from 'shared/mock';

import { ItemSettingsController } from './ItemSettingsController';
import { ItemSettingsGroupNames } from './ItemSettingsController.const';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

const getMockedAppletFormData = (item) => ({
  ...mockedAppletFormData,
  activities: [{ ...mockedAppletFormData.activities[0], items: [item] }],
});
const expandAllPanels = () => {
  const collapseButtons = document.querySelectorAll('.svg-navigate-down');

  collapseButtons.forEach((button) => {
    fireEvent.click(button);
  });
};

const mockedSingleSelectWithTextInputRequired = {
  ...mockedSingleSelectFormValues,
  config: {
    ...mockedSingleSelectFormValues.config,
    additionalResponseOption: {
      textInputOption: true,
      textInputRequired: true,
    },
  },
};
const mockedSliderWithScores = {
  ...mockedSliderFormValues,
  responseValues: {
    ...mockedSliderFormValues.responseValues,
    scores: [1, 2, 3, 4],
  },
  config: {
    ...mockedSliderFormValues.config,
    addScores: true,
  },
};
const mockedSingleSelectWithoutScores = {
  ...mockedSingleSelectFormValues,
  responseValues: {
    options: mockedSingleSelectFormValues.responseValues.options.map((option) => ({
      ...option,
      score: undefined,
    })),
  },
  config: {
    ...mockedSingleSelectFormValues.config,
    addScores: false,
  },
};
const mockedSingleSelectWithAlerts = {
  ...mockedSingleSelectFormValues,
  alerts: [{ key: uuidv4(), alert: '', value: '' }],
  config: {
    setAlerts: true,
  },
};
const mockedSliderWithAlerts = {
  ...mockedSliderFormValues,
  alerts: [{ key: uuidv4(), alert: '', value: 0 }],
  config: {
    setAlerts: true,
  },
};
const mockedContinuousSlider = {
  ...mockedSliderFormValues,
  config: {
    continuousSlider: true,
  },
};
const mockedContinuousSliderWithAlerts = {
  ...mockedSliderFormValues,
  alerts: [{ key: uuidv4(), alert: '', value: '' }],
  config: {
    continuousSlider: true,
    setAlerts: true,
  },
};
const mockedSingleSelectPerRowWithAlerts = {
  ...mockedSingleSelectPerRowFormValues,
  alerts: [{ key: uuidv4(), alert: '', rowId: '', optionId: '' }],
  config: {
    setAlerts: true,
  },
};
const mockedSliderRowsFormValuesWithAlerts = {
  ...mockedSliderRowsFormValues,
  alerts: [{ key: uuidv4(), alert: '', sliderId: '', value: '' }],
  config: {
    setAlerts: true,
  },
};
const mockedSingleSelectWithNullableScores = {
  ...mockedSingleSelectFormValues,
  responseValues: {
    ...mockedSingleSelectFormValues.responseValues,
    options: mockedSingleSelectFormValues.responseValues.options.map((option) => ({
      ...option,
      score: 0,
    })),
  },
};
const mockedSliderWithNoScores = {
  ...mockedSliderFormValues,
  responseValues: {
    ...mockedSliderFormValues.responseValues,
    scores: undefined,
  },
  config: {
    addScores: false,
  },
};

const mockedSettingsByType = {
  [ItemResponseType.SingleSelection]: [
    ItemConfigurationSettings.HasAutoAdvance,
    ItemConfigurationSettings.HasColorPalette,
    ItemConfigurationSettings.HasTooltips,
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.HasRandomize,
    ItemConfigurationSettings.HasScores,
    ItemConfigurationSettings.HasAlerts,
  ],
  [ItemResponseType.MultipleSelection]: [
    ItemConfigurationSettings.HasColorPalette,
    ItemConfigurationSettings.HasTooltips,
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.HasRandomize,
    ItemConfigurationSettings.HasScores,
    ItemConfigurationSettings.HasAlerts,
  ],
  [ItemResponseType.Slider]: [
    ItemConfigurationSettings.HasTickMarks,
    ItemConfigurationSettings.HasTickMarksLabels,
    ItemConfigurationSettings.IsContinuous,
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.HasScores,
    ItemConfigurationSettings.HasAlerts,
  ],
  [ItemResponseType.Date]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.NumberSelection]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.TimeRange]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.Geolocation]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.Audio]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.SingleSelectionPerRow]: [
    ItemConfigurationSettings.HasTooltips,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.HasAlerts,
  ],
  [ItemResponseType.MultipleSelectionPerRow]: [
    ItemConfigurationSettings.HasTooltips,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.HasAlerts,
  ],
  [ItemResponseType.SliderRows]: [
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.HasAlerts,
  ],
  [ItemResponseType.Text]: [
    ItemConfigurationSettings.IsCorrectAnswerRequired,
    ItemConfigurationSettings.IsNumericalRequired,
    ItemConfigurationSettings.HasResponseDataIdentifier,
    ItemConfigurationSettings.IsResponseRequired,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.Drawing]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
    ItemConfigurationSettings.IsUndoRemoved,
    ItemConfigurationSettings.IsNavigationMovedToTheTop,
  ],
  [ItemResponseType.Photo]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.Video]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.Message]: [ItemConfigurationSettings.HasTimer, ItemConfigurationSettings.IsGoBackRemoved],
  [ItemResponseType.AudioPlayer]: [
    ItemConfigurationSettings.IsPlayAudioOnce,
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
  [ItemResponseType.Time]: [
    ItemConfigurationSettings.HasTextInput,
    ItemConfigurationSettings.IsTextInputRequired,
    ItemConfigurationSettings.HasTimer,
    ItemConfigurationSettings.IsSkippable,
    ItemConfigurationSettings.IsGoBackRemoved,
  ],
};
const mockedSettingGroupsByType = {
  [ItemResponseType.SingleSelection]: [
    ItemSettingsGroupNames.ResponseOptions,
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
    ItemSettingsGroupNames.ScoresAndAlerts,
  ],
  [ItemResponseType.MultipleSelection]: [
    ItemSettingsGroupNames.ResponseOptions,
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
    ItemSettingsGroupNames.ScoresAndAlerts,
  ],
  [ItemResponseType.Slider]: [
    ItemSettingsGroupNames.ResponseOptions,
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
    ItemSettingsGroupNames.ScoresAndAlerts,
  ],
  [ItemResponseType.Date]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.NumberSelection]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.TimeRange]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.Geolocation]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.Audio]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.SingleSelectionPerRow]: [
    ItemSettingsGroupNames.ResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
    ItemSettingsGroupNames.ScoresAndAlerts,
  ],
  [ItemResponseType.MultipleSelectionPerRow]: [
    ItemSettingsGroupNames.ResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
    ItemSettingsGroupNames.ScoresAndAlerts,
  ],
  [ItemResponseType.SliderRows]: [
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
    ItemSettingsGroupNames.ScoresAndAlerts,
  ],
  [ItemResponseType.Text]: [ItemSettingsGroupNames.ResponseOptions, ItemSettingsGroupNames.ScreenConfigurations],
  [ItemResponseType.Drawing]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.Photo]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.Video]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
  [ItemResponseType.Message]: [ItemSettingsGroupNames.ScreenConfigurationsAndTimer],
  [ItemResponseType.AudioPlayer]: [
    ItemSettingsGroupNames.AudioPlayerOptions,
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurations,
  ],
  [ItemResponseType.Time]: [
    ItemSettingsGroupNames.AdditionalResponseOptions,
    ItemSettingsGroupNames.ScreenConfigurationsAndTimer,
  ],
};

describe('ItemSettingsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("doesn't render if inputType is not provided", () => {
    const container = renderWithAppletFormData({
      children: <ItemSettingsController itemName="" inputType="" name="" />,
    });

    expect(container.container).toBeEmptyDOMElement();
  });

  test("doesn't render if inputType is not in enum", () => {
    const container = renderWithAppletFormData({
      children: <ItemSettingsController itemName="" inputType={ItemResponseType.Flanker} name="" />,
    });

    expect(container.container).toBeEmptyDOMElement();
  });

  test.each`
    inputType                                   | description
    ${ItemResponseType.SingleSelection}         | ${'settings and order for SingleSelection are correct'}
    ${ItemResponseType.MultipleSelection}       | ${'settings and order for MultipleSelection are correct'}
    ${ItemResponseType.Slider}                  | ${'settings and order for Slider are correct'}
    ${ItemResponseType.Date}                    | ${'settings and order for Date are correct'}
    ${ItemResponseType.NumberSelection}         | ${'settings and order for NumberSelection are correct'}
    ${ItemResponseType.TimeRange}               | ${'settings and order for TimeRange are correct'}
    ${ItemResponseType.SingleSelectionPerRow}   | ${'settings and order for SingleSelectionPerRow are correct'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'settings and order for MultipleSelectionPerRow are correct'}
    ${ItemResponseType.SliderRows}              | ${'settings and order for SliderRows are correct'}
    ${ItemResponseType.Text}                    | ${'settings and order for Text are correct'}
    ${ItemResponseType.Drawing}                 | ${'settings and order for Drawing are correct'}
    ${ItemResponseType.Photo}                   | ${'settings and order for Photo are correct'}
    ${ItemResponseType.Video}                   | ${'settings and order for Video are correct'}
    ${ItemResponseType.Geolocation}             | ${'settings and order for Geolocation are correct'}
    ${ItemResponseType.Audio}                   | ${'settings and order for Audio are correct'}
    ${ItemResponseType.Message}                 | ${'settings and order for Message are correct'}
    ${ItemResponseType.AudioPlayer}             | ${'settings and order for AudioPlayer are correct'}
    ${ItemResponseType.Time}                    | ${'settings and order for Time are correct'}
  `('$description', ({ inputType }) => {
    renderWithAppletFormData({
      children: <ItemSettingsController itemName="" inputType={inputType} name="" />,
    });

    expandAllPanels();

    const mockedSettings = mockedSettingsByType[inputType];
    const settings = document.querySelectorAll('label[data-testid^="builder-activity-items-item-settings"]');

    expect(settings.length).toEqual(mockedSettings.length);

    settings.forEach((setting, index) => {
      const mockedSetting = mockedSettings[index];

      expect(screen.getByTestId(`builder-activity-items-item-settings-${mockedSetting}`)).toEqual(setting);
    });
  });

  test.each`
    inputType                                   | description
    ${ItemResponseType.SingleSelection}         | ${'setting groups and order for SingleSelection are correct'}
    ${ItemResponseType.MultipleSelection}       | ${'setting groups and order for MultipleSelection are correct'}
    ${ItemResponseType.Slider}                  | ${'setting groups and order for Slider are correct'}
    ${ItemResponseType.Date}                    | ${'setting groups and order for Date are correct'}
    ${ItemResponseType.NumberSelection}         | ${'setting groups and order for NumberSelection are correct'}
    ${ItemResponseType.TimeRange}               | ${'setting groups and order for TimeRange are correct'}
    ${ItemResponseType.SingleSelectionPerRow}   | ${'setting groups and order for SingleSelectionPerRow are correct'}
    ${ItemResponseType.MultipleSelectionPerRow} | ${'setting groups and order for MultipleSelectionPerRow are correct'}
    ${ItemResponseType.SliderRows}              | ${'setting groups and order for SliderRows are correct'}
    ${ItemResponseType.Text}                    | ${'setting groups and order for Text are correct'}
    ${ItemResponseType.Drawing}                 | ${'setting groups and order for Drawing are correct'}
    ${ItemResponseType.Photo}                   | ${'setting groups and order for Photo are correct'}
    ${ItemResponseType.Video}                   | ${'setting groups and order for Video are correct'}
    ${ItemResponseType.Geolocation}             | ${'setting groups and order for Geolocation are correct'}
    ${ItemResponseType.Audio}                   | ${'setting groups and order for Audio are correct'}
    ${ItemResponseType.Message}                 | ${'setting groups and order for Message are correct'}
    ${ItemResponseType.AudioPlayer}             | ${'setting groups and order for AudioPlayer are correct'}
    ${ItemResponseType.Time}                    | ${'setting groups and order for Time are correct'}
  `('$description', ({ inputType }) => {
    renderWithAppletFormData({
      children: <ItemSettingsController itemName="" inputType={inputType} name="" />,
    });

    const mockedGroups = mockedSettingGroupsByType[inputType];
    const groups = screen.queryAllByTestId((content) =>
      content.startsWith('builder-activity-items-item-settings-group-container'),
    );

    expect(groups.length).toEqual(mockedGroups.length);

    groups.forEach((group, index) => {
      const mockedGroup = mockedGroups[index];

      expect(screen.getByTestId(`builder-activity-items-item-settings-group-container-${mockedGroup}`)).toEqual(group);
    });
  });

  test.each`
    settingKey                                             | item                            | description
    ${ItemConfigurationSettings.HasAutoAdvance}            | ${mockedSingleSelectFormValues} | ${'Auto-advance set data in config correctly'}
    ${ItemConfigurationSettings.HasScores}                 | ${mockedSingleSelectFormValues} | ${'HasScores set data in config correctly'}
    ${ItemConfigurationSettings.HasTooltips}               | ${mockedSingleSelectFormValues} | ${'HasTooltips set data in config correctly'}
    ${ItemConfigurationSettings.HasAlerts}                 | ${mockedSingleSelectFormValues} | ${'HasAlerts set data in config correctly'}
    ${ItemConfigurationSettings.HasTextInput}              | ${mockedSingleSelectFormValues} | ${'HasTextInput set data in config correctly'}
    ${ItemConfigurationSettings.HasColorPalette}           | ${mockedSingleSelectFormValues} | ${'HasColorPalette set data in config correctly'}
    ${ItemConfigurationSettings.IsTextInputRequired}       | ${mockedSingleSelectFormValues} | ${'IsTextInputRequired set data in config correctly'}
    ${ItemConfigurationSettings.HasTimer}                  | ${mockedSingleSelectFormValues} | ${'HasTimer set data in config correctly'}
    ${ItemConfigurationSettings.IsSkippable}               | ${mockedSingleSelectFormValues} | ${'IsSkippable set data in config correctly'}
    ${ItemConfigurationSettings.IsGoBackRemoved}           | ${mockedSingleSelectFormValues} | ${'IsGoBackRemoved set data in config correctly'}
    ${ItemConfigurationSettings.HasRandomize}              | ${mockedSingleSelectFormValues} | ${'HasRandomize set data in config correctly'}
    ${ItemConfigurationSettings.HasTickMarks}              | ${mockedSliderFormValues}       | ${'HasTickMarks set data in config correctly'}
    ${ItemConfigurationSettings.HasTickMarksLabels}        | ${mockedSliderFormValues}       | ${'HasTickMarksLabels set data in config correctly'}
    ${ItemConfigurationSettings.IsContinuous}              | ${mockedSliderFormValues}       | ${'IsContinuous set data in config correctly'}
    ${ItemConfigurationSettings.HasResponseDataIdentifier} | ${mockedTextFormValues}         | ${'HasResponseDataIdentifier set data in config correctly'}
    ${ItemConfigurationSettings.IsCorrectAnswerRequired}   | ${mockedTextFormValues}         | ${'IsCorrectAnswerRequired set data in config correctly'}
    ${ItemConfigurationSettings.IsNumericalRequired}       | ${mockedTextFormValues}         | ${'IsNumericalRequired set data in config correctly'}
    ${ItemConfigurationSettings.IsResponseRequired}        | ${mockedTextFormValues}         | ${'IsResponseRequired set data in config correctly'}
    ${ItemConfigurationSettings.IsPlayAudioOnce}           | ${mockedAudioPlayerFormValues}  | ${'IsPlayAudioOnce set data in config correctly'}
    ${ItemConfigurationSettings.IsUndoRemoved}             | ${mockedDrawingFormValues}      | ${'IsUndoRemoved set data in config correctly'}
    ${ItemConfigurationSettings.IsNavigationMovedToTheTop} | ${mockedDrawingFormValues}      | ${'IsNavigationMovedToTheTop set data in config correctly'}
  `('$description', ({ settingKey, item }) => {
    const ref = createRef();

    renderWithAppletFormData({
      formRef: ref,
      children: (
        <ItemSettingsController
          itemName="activities.0.items.0"
          inputType={item.responseType}
          name="activities.0.items.0.config"
        />
      ),
      appletFormData: getMockedAppletFormData(item),
    });

    expandAllPanels();

    const setting = screen.getByTestId(`builder-activity-items-item-settings-${settingKey}`);

    const prevValue = get(item, `config.${settingKey}`);

    if (settingKey === ItemConfigurationSettings.IsTextInputRequired) {
      expect(setting.querySelector('input')).toHaveAttribute('disabled');

      const textInputOption = screen.getByTestId(
        `builder-activity-items-item-settings-${ItemConfigurationSettings.HasTextInput}`,
      );
      fireEvent.click(textInputOption);
    }

    fireEvent.click(setting);

    const changedItemConfig = ref.current?.getValues('activities.0.items.0.config');

    if (settingKey === ItemConfigurationSettings.HasTimer)
      return expect(get(changedItemConfig, settingKey)).toEqual(100);

    expect(get(changedItemConfig, settingKey)).toEqual(!prevValue);
  });

  test.each`
    settingKey                                           | propToCheck                                                                 | item                                       | prevValue                                                 | expected                                                       | description
    ${ItemConfigurationSettings.HasTimer}                | ${'activities.0.items.0.config.timer'}                                      | ${mockedSingleSelectFormValues}            | ${0}                                                      | ${100}                                                         | ${'opting in Timer sets correct timer value'}
    ${ItemConfigurationSettings.IsResponseRequired}      | ${'activities.0.items.0.config.skippableItem'}                              | ${mockedTextFormValues}                    | ${true}                                                   | ${false}                                                       | ${'opting in ResponseRequired sets SkippableItem to false'}
    ${ItemConfigurationSettings.HasTextInput}            | ${'activities.0.items.0.config.additionalResponseOption.textInputRequired'} | ${mockedSingleSelectWithTextInputRequired} | ${true}                                                   | ${false}                                                       | ${'opting out TextInputOption with opted in TextInputRequired sets TextInputRequired to false'}
    ${ItemConfigurationSettings.IsCorrectAnswerRequired} | ${'activities.0.items.0.config.correctAnswer'}                              | ${mockedTextFormValues}                    | ${undefined}                                              | ${''}                                                          | ${'opting in CorrectAnswerRequired sets to correctAnswer empty string in config'}
    ${ItemConfigurationSettings.HasScores}               | ${'activities.0.items.0.responseValues.scores'}                             | ${mockedSliderWithNoScores}                | ${undefined}                                              | ${[1, 2, 3, 4]}                                                | ${'opting in scores for Slider sets scores in responseValues'}
    ${ItemConfigurationSettings.HasScores}               | ${'activities.0.items.0.responseValues.scores'}                             | ${mockedSliderWithScores}                  | ${[1, 2, 3, 4]}                                           | ${undefined}                                                   | ${'opting out scores for Slider sets scores as undefined in responseValues'}
    ${ItemConfigurationSettings.HasScores}               | ${'activities.0.items.0.responseValues.options'}                            | ${mockedSingleSelectWithoutScores}         | ${mockedSingleSelectWithoutScores.responseValues.options} | ${mockedSingleSelectWithNullableScores.responseValues.options} | ${'opting in scores for SingleSelect sets scores in responseValues'}
    ${ItemConfigurationSettings.HasScores}               | ${'activities.0.items.0.responseValues.options'}                            | ${mockedSingleSelectFormValues}            | ${mockedSingleSelectFormValues.responseValues.options}    | ${mockedSingleSelectWithoutScores.responseValues.options}      | ${'opting out scores for SingleSelect sets scores as undefined in responseValues'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.alert'}                                    | ${mockedSingleSelectFormValues}            | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "alert" prop for alerts for single/multi selection correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.value'}                                    | ${mockedSingleSelectFormValues}            | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "value" prop for alerts for single/multi selection correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts'}                                            | ${mockedSingleSelectWithAlerts}            | ${mockedSingleSelectWithAlerts.alerts}                    | ${undefined}                                                   | ${'opting out HasAlerts sets alerts as undefined for single/multi selection'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.alert'}                                    | ${mockedSliderFormValues}                  | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "alert" prop for alerts for slider without IsContinuous correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.value'}                                    | ${mockedSliderFormValues}                  | ${undefined}                                              | ${mockedSliderWithAlerts.responseValues.minValue}              | ${'opting in HasAlerts sets "value" prop for alerts for slider without IsContinuous correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts'}                                            | ${mockedSliderWithAlerts}                  | ${mockedSliderWithAlerts.alerts}                          | ${undefined}                                                   | ${'opting out HasAlerts sets alerts as undefined for slider without IsContinuous'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.alert'}                                    | ${mockedContinuousSlider}                  | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "alert" prop for alerts for slider with IsContinuous correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.minValue'}                                 | ${mockedContinuousSlider}                  | ${undefined}                                              | ${mockedContinuousSlider.responseValues.minValue}              | ${'opting in HasAlerts sets "minValue" prop for alerts for slider with IsContinuous correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.maxValue'}                                 | ${mockedContinuousSlider}                  | ${undefined}                                              | ${mockedContinuousSlider.responseValues.maxValue}              | ${'opting in HasAlerts sets "maxValue" prop for alerts for slider with IsContinuous correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts'}                                            | ${mockedContinuousSliderWithAlerts}        | ${mockedContinuousSliderWithAlerts.alerts}                | ${undefined}                                                   | ${'opting out HasAlerts sets alerts as undefined for slider with IsContinuous'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.alert'}                                    | ${mockedSingleSelectPerRowFormValues}      | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "alert" prop for alerts for single/multiselectrows correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.rowId'}                                    | ${mockedSingleSelectPerRowFormValues}      | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "rowId" prop for alerts for single/multiselectrows correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.optionId'}                                 | ${mockedSingleSelectPerRowFormValues}      | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "optionId" prop for alerts for single/multiselectrows correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts'}                                            | ${mockedSingleSelectPerRowWithAlerts}      | ${mockedSingleSelectPerRowWithAlerts.alerts}              | ${undefined}                                                   | ${'opting out HasAlerts sets alerts as undefined for single/multiselectrows'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.alert'}                                    | ${mockedSliderRowsFormValues}              | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "alert" prop for alerts for sliderrows correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.sliderId'}                                 | ${mockedSliderRowsFormValues}              | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "sliderId" prop for alerts for sliderrows correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts.0.value'}                                    | ${mockedSliderRowsFormValues}              | ${undefined}                                              | ${''}                                                          | ${'opting in HasAlerts sets "value" prop for alerts for sliderrows correctly'}
    ${ItemConfigurationSettings.HasAlerts}               | ${'activities.0.items.0.alerts'}                                            | ${mockedSliderRowsFormValuesWithAlerts}    | ${mockedSliderRowsFormValuesWithAlerts.alerts}            | ${undefined}                                                   | ${'opting out HasAlerts sets alerts as undefined for sliderrows'}
  `('$description', ({ settingKey, propToCheck, prevValue, item, expected }) => {
    const ref = createRef();

    renderWithAppletFormData({
      formRef: ref,
      children: (
        <ItemSettingsController
          itemName="activities.0.items.0"
          inputType={item.responseType}
          name="activities.0.items.0.config"
        />
      ),
      appletFormData: getMockedAppletFormData(item),
    });

    const { getValues } = ref.current;

    const initialValue = getValues(propToCheck);

    expect(initialValue).toEqual(prevValue);

    expandAllPanels();

    const setting = screen.getByTestId(`builder-activity-items-item-settings-${settingKey}`);

    fireEvent.click(setting);

    const changedValue = getValues(propToCheck);
    expect(changedValue).toStrictEqual(expected);
  });

  test.each`
    settingKey                                             | item                            | expected | description
    ${ItemConfigurationSettings.HasAutoAdvance}            | ${mockedSingleSelectFormValues} | ${true}  | ${'HasAutoAdvance has tooltip'}
    ${ItemConfigurationSettings.HasScores}                 | ${mockedSingleSelectFormValues} | ${false} | ${'HasScores has no tooltip'}
    ${ItemConfigurationSettings.HasTooltips}               | ${mockedSingleSelectFormValues} | ${false} | ${'HasTooltips has no tooltip'}
    ${ItemConfigurationSettings.HasAlerts}                 | ${mockedSingleSelectFormValues} | ${true}  | ${'HasAlerts has tooltip'}
    ${ItemConfigurationSettings.HasTextInput}              | ${mockedSingleSelectFormValues} | ${true}  | ${'HasTextInput has tooltip'}
    ${ItemConfigurationSettings.HasColorPalette}           | ${mockedSingleSelectFormValues} | ${false} | ${'HasColorPalette has no tooltip'}
    ${ItemConfigurationSettings.IsTextInputRequired}       | ${mockedSingleSelectFormValues} | ${true}  | ${'IsTextInputRequired has tooltip'}
    ${ItemConfigurationSettings.HasTimer}                  | ${mockedSingleSelectFormValues} | ${true}  | ${'HasTimer has tooltip'}
    ${ItemConfigurationSettings.IsSkippable}               | ${mockedSingleSelectFormValues} | ${true}  | ${'IsSkippable has tooltip'}
    ${ItemConfigurationSettings.IsGoBackRemoved}           | ${mockedSingleSelectFormValues} | ${true}  | ${'IsGoBackRemoved has tooltip'}
    ${ItemConfigurationSettings.HasRandomize}              | ${mockedSingleSelectFormValues} | ${true}  | ${'HasRandomize has tooltip'}
    ${ItemConfigurationSettings.HasTickMarks}              | ${mockedSliderFormValues}       | ${true}  | ${'HasTickMarks has tooltip'}
    ${ItemConfigurationSettings.HasTickMarksLabels}        | ${mockedSliderFormValues}       | ${true}  | ${'HasTickMarksLabels has tooltip'}
    ${ItemConfigurationSettings.IsContinuous}              | ${mockedSliderFormValues}       | ${true}  | ${'IsContinuous has tooltip'}
    ${ItemConfigurationSettings.HasResponseDataIdentifier} | ${mockedTextFormValues}         | ${true}  | ${'HasResponseDataIdentifier has tooltip'}
    ${ItemConfigurationSettings.IsCorrectAnswerRequired}   | ${mockedTextFormValues}         | ${true}  | ${'IsCorrectAnswerRequired has tooltip'}
    ${ItemConfigurationSettings.IsNumericalRequired}       | ${mockedTextFormValues}         | ${true}  | ${'IsNumericalRequired has tooltip'}
    ${ItemConfigurationSettings.IsResponseRequired}        | ${mockedTextFormValues}         | ${true}  | ${'IsResponseRequired has tooltip'}
    ${ItemConfigurationSettings.IsPlayAudioOnce}           | ${mockedAudioPlayerFormValues}  | ${true}  | ${'IsPlayAudioOnce has tooltip'}
    ${ItemConfigurationSettings.IsUndoRemoved}             | ${mockedDrawingFormValues}      | ${true}  | ${'IsUndoRemoved has tooltip'}
    ${ItemConfigurationSettings.IsNavigationMovedToTheTop} | ${mockedDrawingFormValues}      | ${true}  | ${'IsNavigationMovedToTheTop has tooltip'}
  `('$description', ({ settingKey, item, expected }) => {
    renderWithAppletFormData({
      children: (
        <ItemSettingsController
          itemName="activities.0.items.0"
          inputType={item.responseType}
          name="activities.0.items.0.config"
        />
      ),
      appletFormData: getMockedAppletFormData(item),
    });

    expandAllPanels();

    const setting = screen.getByTestId(`builder-activity-items-item-settings-${settingKey}`);
    const tooltip = setting.querySelector('.svg-more-info-outlined');

    expected ? expect(tooltip).toBeInTheDocument() : expect(tooltip).not.toBeInTheDocument();
  });

  test('HasTimer: renders additional number input', () => {
    renderWithAppletFormData({
      children: (
        <ItemSettingsController
          itemName="activities.0.items.0"
          inputType={mockedSingleSelectFormValues.responseType}
          name="activities.0.items.0.config"
        />
      ),
    });

    expandAllPanels();

    const timerInput = screen.getByTestId(
      `builder-activity-items-item-settings-${ItemConfigurationSettings.HasTimer}-input`,
    );

    expect(timerInput).toBeInTheDocument();
  });

  test.each`
    action      | expected | description
    ${'manual'} | ${200}   | ${'HasTimer: manual input sets correct value'}
    ${'inc'}    | ${101}   | ${'HasTimer: increment sets correct value'}
    ${'dec'}    | ${99}    | ${'HasTimer: decrement sets correct value'}
  `('$description', ({ action, expected }) => {
    const ref = createRef();

    renderWithAppletFormData({
      children: (
        <ItemSettingsController
          itemName="activities.0.items.0"
          inputType={mockedSingleSelectFormValues.responseType}
          name="activities.0.items.0.config"
        />
      ),
      formRef: ref,
    });

    expandAllPanels();

    const timerSetting = screen.getByTestId(
      `builder-activity-items-item-settings-${ItemConfigurationSettings.HasTimer}`,
    );
    fireEvent.click(timerSetting);

    const timerInput = screen.getByTestId(
      `builder-activity-items-item-settings-${ItemConfigurationSettings.HasTimer}-input`,
    );
    const input = timerInput.querySelector('input');
    const increment = timerInput.querySelector('button:first-child');
    const decrement = timerInput.querySelector('button:last-child');

    const mockedEventByAction = {
      manual: () => fireEvent.change(input, { target: { value: 200 } }),
      inc: () => fireEvent.click(increment),
      dec: () => fireEvent.click(decrement),
    };

    mockedEventByAction[action]();

    expect(ref.current.getValues(`activities.0.items.0.config.${ItemConfigurationSettings.HasTimer}`)).toEqual(
      expected,
    );
  });
});
