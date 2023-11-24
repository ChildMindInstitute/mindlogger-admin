// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';

import { mockedAppletFormData, mockedSingleSelectFormValues } from 'shared/mock';
import { ItemResponseType, CHANGE_DEBOUNCE_VALUE } from 'shared/consts';
import { createArray } from 'shared/utils';
import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { getNewActivityItem } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

import { ItemConfiguration } from './ItemConfiguration';

const removeUuidValues = (item) => {
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    appletId: mockedAppletFormData.id,
    activityId: mockedAppletFormData.activities[0].id,
  }),
}));

const mockedOnClose = jest.fn();

const mockedItemName = 'activities.0.items.0';
const mockedEmptyItem = getNewActivityItem();
const getAppletFormDataWithItem = (item = mockedEmptyItem, activity) => ({
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      ...activity,
      items: [item],
    },
  ],
});

const mockedItemTypes = [
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
const mockedItemTypeGroups = ['select', 'matrixSelect', 'input', 'record', 'display'];
const mockedItemTypesMobileOnly = [
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
const mockedTypeTestid = 'builder-activity-items-item-configuration-response-type';
const mockedOptionTestid = 'builder-activity-items-item-configuration-response-type-option';
const mockedGroupTestid = 'builder-activity-items-item-configuration-response-type-group';
const mockedSearchTestid = 'builder-activity-items-item-configuration-response-type-search';
const mockedNameTestid = 'builder-activity-items-item-configuration-name';
const mockedDisplayedContentTestid = 'builder-activity-items-item-configuration-description';

const mockedEmptySingleSelection = {
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
const mockedEmptyMultiSelection = {
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
const mockedEmptySlider = {
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
const mockedEmptyDate = {
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
const mockedEmptyNumberSelection = {
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
const mockedEmptyTime = {
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
const mockedEmptyTimeRange = {
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
const mockedEmptySingleSelectRows = {
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
const mockedEmptyMultiSelectRows = {
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
const mockedEmptySliderRows = {
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
const mockedEmptyText = {
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
const mockedEmptyDrawing = {
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
const mockedEmptyPhoto = {
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
const mockedEmptyVideo = {
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
const mockedEmptyGeolocation = {
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
const mockedEmptyAudio = {
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
const mockedEmptyMessage = {
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
const mockedEmptyAudioPlayer = {
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

describe('ItemConfiguration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Item Type', () => {
    test('is rendered with correct item types, groups and "mobile only"', () => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(),
      });

      const type = screen.getByTestId(mockedTypeTestid);
      const typeButton = type.querySelector('[role="button"]');
      fireEvent.mouseDown(typeButton);

      mockedItemTypes.forEach((itemType) => {
        const option = screen.getByTestId(`${mockedOptionTestid}-${itemType}`);

        expect(option).toHaveAttribute('data-value', itemType);

        if (mockedItemTypesMobileOnly.includes(itemType))
          expect(option).toHaveTextContent(/mobile only$/i);
      });
      mockedItemTypeGroups.forEach((groupName) => {
        const group = screen.getByTestId(`${mockedGroupTestid}-${groupName}`);

        expect(group).toBeInTheDocument();
      });
    });

    test.each`
      isReviewable | expected | description
      ${false}     | ${18}    | ${'renders correct number of item types with isReviewable = false'}
      ${true}      | ${3}     | ${'renders correct number of item types with isReviewable = true'}
    `('$description', ({ isReviewable, expected }) => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(mockedEmptyItem, { isReviewable }),
      });

      const type = screen.getByTestId(mockedTypeTestid);
      const typeButton = type.querySelector('[role="button"]');
      fireEvent.mouseDown(typeButton);

      const options = screen.getAllByTestId((testId) => testId.startsWith(mockedOptionTestid));

      expect(options).toHaveLength(expected);
    });

    test.each`
      item                            | expected          | description
      ${mockedEmptyItem}              | ${undefined}      | ${'is rendered without value for newly created item'}
      ${mockedSingleSelectFormValues} | ${'singleSelect'} | ${'is rendered with correct value for existing item'}
    `('$description', ({ item, expected }) => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(item),
      });

      expect(
        screen.getByTestId('builder-activity-items-item-configuration-response-type'),
      ).toBeInTheDocument();

      const input = document.querySelector(
        '[data-testid="builder-activity-items-item-configuration-response-type"] input',
      );
      expected ? expect(input).toHaveValue(expected) : expect(input).not.toHaveValue();
    });

    test.each`
      searchText   | expected | description
      ${'select'}  | ${5}     | ${'search shows only existing item types and highlights matched text'}
      ${'selectt'} | ${0}     | ${'search shows empty result if there are no matches'}
    `('$description', ({ searchText, expected }) => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(),
      });

      const type = screen.getByTestId(mockedTypeTestid);
      const typeButton = type.querySelector('[role="button"]');
      fireEvent.mouseDown(typeButton);

      const search = screen.getByTestId(mockedSearchTestid);
      const searchInput = search.querySelector('input');
      fireEvent.change(searchInput, { target: { value: searchText } });

      const itemTypes = screen.getAllByTestId((testId) => testId.startsWith(mockedOptionTestid));
      const visibleItemTypes = itemTypes.filter(
        (itemType) => window.getComputedStyle(itemType).display !== 'none',
      );

      expect(visibleItemTypes).toHaveLength(expected);

      visibleItemTypes.forEach((itemType) => {
        expect(itemType.querySelector('.highlighted-text')).toHaveTextContent(
          new RegExp(`^${searchText}$`, 'i'),
        );
      });

      if (expected === 0) {
        expect(screen.getByTestId(`${mockedTypeTestid}-empty-search`)).toBeVisible();
      }
    });

    test.each`
      itemType                                    | expected                       | description
      ${ItemResponseType.SingleSelection}         | ${mockedEmptySingleSelection}  | ${'selecting SingleSelection sets correct data to the form'}
      ${ItemResponseType.MultipleSelection}       | ${mockedEmptyMultiSelection}   | ${'selecting MultipleSelection sets correct data to the form'}
      ${ItemResponseType.Slider}                  | ${mockedEmptySlider}           | ${'selecting Slider sets correct data to the form'}
      ${ItemResponseType.Date}                    | ${mockedEmptyDate}             | ${'selecting Date sets correct data to the form'}
      ${ItemResponseType.NumberSelection}         | ${mockedEmptyNumberSelection}  | ${'selecting NumberSelection sets correct data to the form'}
      ${ItemResponseType.TimeRange}               | ${mockedEmptyTimeRange}        | ${'selecting TimeRange sets correct data to the form'}
      ${ItemResponseType.SingleSelectionPerRow}   | ${mockedEmptySingleSelectRows} | ${'selecting SingleSelectionPerRow sets correct data to the form'}
      ${ItemResponseType.MultipleSelectionPerRow} | ${mockedEmptyMultiSelectRows}  | ${'selecting MultipleSelectionPerRow sets correct data to the form'}
      ${ItemResponseType.SliderRows}              | ${mockedEmptySliderRows}       | ${'selecting SliderRows sets correct data to the form'}
      ${ItemResponseType.Text}                    | ${mockedEmptyText}             | ${'selecting Text sets correct data to the form'}
      ${ItemResponseType.Drawing}                 | ${mockedEmptyDrawing}          | ${'selecting Drawing sets correct data to the form'}
      ${ItemResponseType.Photo}                   | ${mockedEmptyPhoto}            | ${'selecting Photo sets correct data to the form'}
      ${ItemResponseType.Video}                   | ${mockedEmptyVideo}            | ${'selecting Video sets correct data to the form'}
      ${ItemResponseType.Geolocation}             | ${mockedEmptyGeolocation}      | ${'selecting Geolocation sets correct data to the form'}
      ${ItemResponseType.Audio}                   | ${mockedEmptyAudio}            | ${'selecting Audio sets correct data to the form'}
      ${ItemResponseType.Message}                 | ${mockedEmptyMessage}          | ${'selecting Message sets correct data to the form'}
      ${ItemResponseType.AudioPlayer}             | ${mockedEmptyAudioPlayer}      | ${'selecting AudioPlayer sets correct data to the form'}
      ${ItemResponseType.Time}                    | ${mockedEmptyTime}             | ${'selecting Time sets correct data to the form'}
    `('$description', async ({ itemType, expected }) => {
      const ref = createRef();

      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(),
        formRef: ref,
      });

      const type = screen.getByTestId(mockedTypeTestid);
      const typeButton = type.querySelector('[role="button"]');
      fireEvent.mouseDown(typeButton);

      const option = screen.getByTestId(`${mockedOptionTestid}-${itemType}`);
      fireEvent.click(option);

      expect(ref.current.getValues(`${mockedItemName}.responseType`)).toEqual(itemType);

      const itemValues = ref.current.getValues(mockedItemName);

      expect(removeUuidValues(itemValues)).toStrictEqual(expected);
    });

    test('when submit with empty value should show validation error', async () => {
      const ref = createRef();

      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(),
        formRef: ref,
      });

      await ref.current.trigger(`${mockedItemName}.responseType`);

      await waitFor(() => {
        expect(screen.getByText('Item Type is required')).toBeVisible();
      });
    });
  });

  describe('Item Name', () => {
    test.each`
      item                            | expected   | description
      ${undefined}                    | ${'Item'}  | ${'is rendered with empty string for newly added item'}
      ${mockedSingleSelectFormValues} | ${'Item1'} | ${'is rendered with correct value for existing item'}
    `('$description', ({ item, expected }) => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(item),
      });

      const name = screen.getByTestId(mockedNameTestid);

      expect(name).toBeVisible();
      expect(name.querySelector('input')).toHaveValue(expected);
    });

    test.each`
      text         | expected                                                                         | description
      ${''}        | ${'Item Name is required'}                                                       | ${'empty name is not allowed'}
      ${'Item1!'}  | ${'Item Name must contain only alphanumeric characters, underscores, or hyphen'} | ${'other symbols than a-zA-Z0-9_- are not allowed'}
      ${'Item2'}   | ${'That Item Name is already in use. Please use a different name'}               | ${'name should be unique among the others in activity'}
      ${'Item1_-'} | ${''}                                                                            | ${'name with a-zA-Z0-9_- is allowed'}
    `('$description', async ({ text, expected }) => {
      const ref = createRef();

      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: mockedAppletFormData,
        formRef: ref,
      });

      const name = screen.getByTestId(mockedNameTestid);
      const input = name.querySelector('input');
      const error = name.querySelector('.Mui-error');

      fireEvent.change(input, { target: { value: text } });

      await new Promise((resolve) => setTimeout(resolve, CHANGE_DEBOUNCE_VALUE));

      await ref.current.trigger(`${mockedItemName}.name`);

      await waitFor(() => {
        expected
          ? expect(screen.getByText(expected)).toBeVisible()
          : expect(error).not.toBeInTheDocument();
      });
    });
  });

  describe('Displayed Content', () => {
    test.each`
      item                            | description
      ${mockedEmptyItem}              | ${'is rendered for newly created item'}
      ${mockedSingleSelectFormValues} | ${'is rendered for existing item'}
    `('$description', ({ item }) => {
      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        appletFormData: getAppletFormDataWithItem(item),
      });

      const displayedContent = screen.getByTestId(mockedDisplayedContentTestid);

      expect(displayedContent).toBeVisible();
    });

    test.each`
      text                                    | expected                                                        | description
      ${''}                                   | ${'Displayed Content is required'}                              | ${'cannot be empty'}
      ${createArray(175, () => 'i').join('')} | ${'Visibility decreases over 75 characters'}                    | ${'shows warning for text more than 75 chars'}
      ${'[[Item1]]'}                          | ${'* You cannot use item name in the same item. Please remove'} | ${'cannot have item variable with the same name as current item'}
      ${'[[sliderrows]]'}                     | ${'* This item is not supported, please remove it.'}            | ${'item type of selected variable is not supported'}
      ${'[[Item5]]'}                          | ${'Remove the variable referring to the skipped item.'}         | ${'cannot have item variable which is skippable'}
      ${'[[ItemItem]]'}                       | ${'Remove the variable referring to the nonexistent item.'}     | ${'cannot refer to non-existent item'}
    `('$description', async ({ text, expected }) => {
      const ref = createRef();

      renderWithAppletFormData({
        children: <ItemConfiguration name={mockedItemName} onClose={mockedOnClose} />,
        formRef: ref,
      });

      ref.current.setValue(`${mockedItemName}.question`, text);

      await ref.current.trigger(`${mockedItemName}.question`);

      await waitFor(() => {
        expect(screen.getByText(expected)).toBeVisible();
      });
    });
  });
});
