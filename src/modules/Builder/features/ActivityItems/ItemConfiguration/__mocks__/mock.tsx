// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { mockedAppletFormData } from 'shared/mock';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { ItemConfiguration } from '../ItemConfiguration';

const mockedOnClose = jest.fn();

export const mockedItemName = 'activities.0.items.0';
export const mockedTypeTestid = 'builder-activity-items-item-configuration-response-type';
export const mockedOptionTestid = 'builder-activity-items-item-configuration-response-type-option';
export const mockedGroupTestid = 'builder-activity-items-item-configuration-response-type-group';
export const mockedSearchTestid = 'builder-activity-items-item-configuration-response-type-search';
export const mockedNameTestid = 'builder-activity-items-item-configuration-name';
export const mockedDisplayedContentTestid = 'builder-activity-items-item-configuration-description';
export const mockedSingleAndMultiSelectOptionTestid =
  'builder-activity-items-item-configuration-options-0';

export const mockedPalette1Color = [
  '#ffadad',
  '#ffd6a5',
  '#fdffb6',
  '#caffbf',
  '#9bf6ff',
  '#a0c4ff',
  '#bdb2ff',
  '#ffc6ff',
  '#fffffc',
];

export const mockedEmptyItem = getNewActivityItem();
export const getAppletFormDataWithItem = (item = mockedEmptyItem, activity) => ({
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      ...activity,
      items: [item],
    },
  ],
});
export const removeUuidValues = (item) => {
  const newItem = { ...item };

  delete newItem.key;
  delete newItem.id;

  return {
    ...newItem,
    responseValues: item.responseValues
      ? {
          ...item.responseValues,
          ...(item.responseValues.options && {
            options: item.responseValues.options.map((option) => {
              const newOption = { ...option };

              delete newOption.id;

              return newOption;
            }),
          }),
          ...(item.responseValues.rows && {
            rows: item.responseValues.rows.map((row) => {
              const newRow = { ...row };

              delete newRow.id;

              return newRow;
            }),
          }),
        }
      : undefined,
  };
};
export const setItemResponseType = (responseType) => {
  const itemType = screen.getByTestId(mockedTypeTestid);
  const typeButton = itemType.querySelector('[role="button"]');
  fireEvent.mouseDown(typeButton);

  const option = screen.getByTestId(`${mockedOptionTestid}-${responseType}`);
  fireEvent.click(option);
};
export const setItemConfigSetting = async (setting) => {
  const settingsButton = screen.getByTestId('builder-activity-items-item-configuration-settings');
  fireEvent.click(settingsButton);

  await waitFor(() => {
    const drawer = screen.getByTestId('builder-activity-items-item-configuration-settings-drawer');
    const collapsedSections = drawer.querySelectorAll('.svg-navigate-down');

    collapsedSections.forEach((section) => {
      fireEvent.click(section);
    });
  });

  const settingCheckbox = screen.getByTestId(`builder-activity-items-item-settings-${setting}`);
  fireEvent.click(settingCheckbox);

  const closeButton = screen.getByTestId('builder-activity-items-item-settings-close');
  fireEvent.click(closeButton);
};

export const renderItemConfiguration = (name = mockedItemName) => (
  <ItemConfiguration name={name} onClose={mockedOnClose} />
);

export const mockedEmptySingleSelection = {
  responseType: 'singleSelect',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    timer: 0,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    paletteName: undefined,
    options: [
      {
        text: '',
        isHidden: false,
        value: 0,
      },
    ],
  },
};
export const mockedEmptyMultiSelection = {
  responseType: 'multiSelect',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    timer: 0,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    paletteName: undefined,
    options: [
      {
        text: '',
        isHidden: false,
        value: 0,
      },
    ],
  },
};
export const mockedEmptySlider = {
  responseType: 'slider',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    addScores: false,
    setAlerts: false,
    showTickMarks: false,
    showTickLabels: false,
    continuousSlider: false,
    timer: 0,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    minValue: 0,
    maxValue: 5,
    minLabel: '',
    maxLabel: '',
    scores: undefined,
  },
};
export const mockedEmptyDate = {
  responseType: 'date',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyNumberSelection = {
  responseType: 'numberSelect',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    minValue: 0,
    maxValue: 1,
  },
};
export const mockedEmptyTime = {
  responseType: 'time',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyTimeRange = {
  responseType: 'timeRange',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptySingleSelectRows = {
  responseType: 'singleSelectRows',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    timer: 0,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    rows: [
      {
        rowName: '',
      },
    ],
    options: [
      {
        text: '',
      },
    ],
  },
};
export const mockedEmptyMultiSelectRows = {
  responseType: 'multiSelectRows',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    timer: 0,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    rows: [
      {
        rowName: '',
      },
    ],
    options: [
      {
        text: '',
      },
    ],
  },
};
export const mockedEmptySliderRows = {
  responseType: 'sliderRows',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    addScores: false,
    setAlerts: false,
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    rows: [
      {
        minValue: 1,
        maxValue: 5,
        minLabel: '',
        maxLabel: '',
        label: '',
        scores: undefined,
      },
      {
        minValue: 1,
        maxValue: 5,
        minLabel: '',
        maxLabel: '',
        label: '',
        scores: undefined,
      },
    ],
  },
};
export const mockedEmptyText = {
  responseType: 'text',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    maxResponseLength: 300,
    correctAnswerRequired: false,
    correctAnswer: '',
    numericalResponseRequired: false,
    responseDataIdentifier: false,
    responseRequired: false,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyDrawing = {
  responseType: 'drawing',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
    removeUndoButton: false,
    navigationToTop: false,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyPhoto = {
  responseType: 'photo',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyVideo = {
  responseType: 'video',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyGeolocation = {
  responseType: 'geolocation',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyAudio = {
  responseType: 'audio',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    maxDuration: 300,
  },
};
export const mockedEmptyMessage = {
  responseType: 'message',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    timer: 0,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {},
};
export const mockedEmptyAudioPlayer = {
  responseType: 'audioPlayer',
  name: 'Item',
  question: '',
  config: {
    removeBackButton: false,
    skippableItem: false,
    additionalResponseOption: {
      textInputOption: false,
      textInputRequired: false,
    },
    playOnce: false,
  },
  isHidden: false,
  allowEdit: true,
  alerts: [],
  responseValues: {
    file: '',
  },
};

export const mockedItemTypes = [
  'singleSelect',
  'multiSelect',
  'slider',
  'date',
  'numberSelect',
  'time',
  'timeRange',
  'singleSelectRows',
  'multiSelectRows',
  'sliderRows',
  'text',
  'drawing',
  'photo',
  'video',
  'geolocation',
  'audio',
  'message',
  'audioPlayer',
];
export const mockedItemTypeGroups = ['select', 'matrixSelect', 'input', 'record', 'display'];
export const mockedItemTypesMobileOnly = [
  'date',
  'time',
  'timeRange',
  'singleSelectRows',
  'multiSelectRows',
  'sliderRows',
  'drawing',
  'photo',
  'video',
  'geolocation',
  'audio',
  'message',
  'audioPlayer',
];
