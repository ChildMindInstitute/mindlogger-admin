import { ItemResponseType } from 'shared/consts';

import {
  formatActivityItemAnswers,
  getSingleMultiSelectionPerRowAnswers,
  getSingleMultiOptionsMapper,
  isAnswerTypeCorrect,
} from './formatActivityItemAnswers';

describe('Respondent Data Summary: formatActivityItemAnswers with helper functions', () => {
  describe('getSingleMultiSelectionPerRowAnswers', () => {
    const date = '2024-03-27T00:09:22.089Z';

    test('should return an array with a single answer object for SingleSelectionPerRow response type', () => {
      const responseType = ItemResponseType.SingleSelectionPerRow;
      const currentAnswer = 'Bad';

      const result = getSingleMultiSelectionPerRowAnswers({ responseType, currentAnswer, date });

      expect(result).toEqual([
        {
          answer: {
            value: currentAnswer,
            text: null,
          },
          date,
        },
      ]);
    });

    test('should return an array with multiple answer objects for MultiSelectionPerRow response types', () => {
      const responseType = ItemResponseType.MultipleSelectionPerRow;
      const currentAnswer = ['Bad', 'Normal', 'Good'];

      const result = getSingleMultiSelectionPerRowAnswers({ responseType, currentAnswer, date });

      expect(result).toEqual([
        {
          answer: {
            value: 'Bad',
            text: null,
          },
          date,
        },
        {
          answer: {
            value: 'Normal',
            text: null,
          },
          date,
        },
        {
          answer: {
            value: 'Good',
            text: null,
          },
          date,
        },
      ]);
    });
  });

  describe('getSingleMultiOptionsMapper', () => {
    const mockFormattedActivityItem = {
      responseValues: {
        options: [
          { value: 3, text: 'Option C' },
          { value: 1, text: 'Option A' },
          { value: 2, text: 'Option B' },
          { value: 4, text: 'Option D' },
        ],
      },
    };

    test('returns correct index for all options', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = getSingleMultiOptionsMapper(mockFormattedActivityItem);

      expect(result).toEqual({
        1: 3,
        2: 2,
        3: 1,
        4: 0,
      });
    });
  });

  describe('isAnswerTypeCorrect', () => {
    test.each`
      answer                  | responseType                          | expectedOutput | description
      ${{ value: 3 }}         | ${ItemResponseType.SingleSelection}   | ${true}        | ${'should return true for a correct single selection/slider answer'}
      ${{ value: 'string' }}  | ${ItemResponseType.SingleSelection}   | ${false}       | ${'should return false for an incorrect single selection/slider answer'}
      ${{ value: [1, 2, 3] }} | ${ItemResponseType.MultipleSelection} | ${true}        | ${'should return true for a correct multiple selection answer'}
      ${{ value: 'string' }}  | ${ItemResponseType.MultipleSelection} | ${false}       | ${'should return false for an incorrect multiple selection answer'}
      ${'string'}             | ${ItemResponseType.Text}              | ${true}        | ${'should return true for a correct text answer'}
      ${{ value: 'string' }}  | ${ItemResponseType.Text}              | ${false}       | ${'should return false for an incorrect text answer'}
    `('$description', ({ answer, responseType, expectedOutput }) => {
      const result = isAnswerTypeCorrect(answer, responseType);
      expect(result).toBe(expectedOutput);
    });
  });

  describe('formatActivityItemAnswers', () => {
    const sharedProps = {
      date: '2024-03-14T10:03:01.345000',
    };

    const singleSelectionProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Single selection question',
          },
          responseType: 'singleSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '3157ca3a-6999-4638-991d-e89e8d0439f6',
                text: 'op1',
                image: null,
                score: 0,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
            ],
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            randomizeOptions: false,
            timer: 0,
            addScores: true,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            autoAdvance: true,
          },
          name: 'single_extraText_and_NO_SCORES',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'ee6ad0fa-3a86-46db-b432-508f803022f6',
          order: 1,
        },
        answers: {
          value: 0,
        },
        items: [], // skip, no need for the test
      },
    };
    const singleSelectionResult = {
      activityItem: {
        id: 'ee6ad0fa-3a86-46db-b432-508f803022f6',
        name: 'single_extraText_and_NO_SCORES',
        question: {
          en: 'Single selection question',
        },
        responseType: 'singleSelect',
        responseValues: {
          options: [
            {
              id: '3157ca3a-6999-4638-991d-e89e8d0439f6',
              text: 'op1',
              value: 0,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const multipleSelectionProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Multi selection question',
          },
          responseType: 'multiSelect',
          responseValues: {
            paletteName: null,
            options: [
              {
                id: '382eb08b-13b4-46dc-83fa-3cf63a026ea0',
                text: 'opt2',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
                isNoneAbove: false,
              },
              {
                id: '2e1e0598-6ed5-4448-b1fd-88447988af30',
                text: 'opt1',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
                isNoneAbove: false,
              },
            ],
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            randomizeOptions: false,
            timer: 0,
            addScores: false,
            setAlerts: false,
            addTooltip: false,
            setPalette: false,
            addTokens: null,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
          },
          name: 'multi_extraText_and_NO_SCORES',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'dc621e85-3bd6-41b7-abb2-12f2c1fca248',
          order: 2,
        },
        answers: {
          value: [1],
        },
        items: [], // skip, no need for the test
      },
    };
    const multipleSelectionResult = {
      activityItem: {
        id: 'dc621e85-3bd6-41b7-abb2-12f2c1fca248',
        name: 'multi_extraText_and_NO_SCORES',
        question: {
          en: 'Multi selection question',
        },
        responseType: 'multiSelect',
        responseValues: {
          options: [
            {
              id: '382eb08b-13b4-46dc-83fa-3cf63a026ea0',
              text: 'opt2',
              value: 0,
            },
            {
              id: '2e1e0598-6ed5-4448-b1fd-88447988af30',
              text: 'opt1',
              value: 1,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const sliderProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Slider question',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'min',
            maxLabel: 'max',
            minValue: 5,
            maxValue: 10,
            minImage: null,
            maxImage: null,
            scores: null,
            alerts: null,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            addScores: false,
            setAlerts: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            showTickMarks: false,
            showTickLabels: false,
            continuousSlider: false,
            timer: 0,
          },
          name: 'slider_extraText_and_NO_SCORES',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '298b1436-3963-41c1-852b-82ebb2ab5468',
          order: 3,
        },
        answers: {
          value: 8,
        },
        items: [], // skip, no need for the test
      },
    };
    const sliderResult = {
      activityItem: {
        id: '298b1436-3963-41c1-852b-82ebb2ab5468',
        name: 'slider_extraText_and_NO_SCORES',
        question: {
          en: 'Slider question',
        },
        responseType: 'slider',
        responseValues: {
          options: [
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-5',
              text: 5,
              value: 5,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-6',
              text: 6,
              value: 6,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-7',
              text: 7,
              value: 7,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-8',
              text: 8,
              value: 8,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-9',
              text: 9,
              value: 9,
            },
            {
              id: '298b1436-3963-41c1-852b-82ebb2ab5468-10',
              text: 10,
              value: 10,
            },
          ],
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const textProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'text question',
          },
          responseType: 'text',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: '',
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: true,
            isIdentifier: null,
          },
          name: 'text_with_response',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'bd670ac1-75a5-4c46-8b70-be664b9e19a5',
          order: 10,
        },
        answers: 'Test',
        items: [], // skip, no need for the test
      },
    };
    const textResult = {
      activityItem: {
        id: 'bd670ac1-75a5-4c46-8b70-be664b9e19a5',
        name: 'text_with_response',
        question: {
          en: 'text question',
        },
        responseDataIdentifier: false,
        responseType: 'text',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            text: null,
            value: undefined,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const timeProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Time question',
          },
          responseType: 'time',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'time_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '6c50d1fa-05f1-4f18-af43-1e568ab9bb0e',
          order: 5,
        },
        answers: {
          value: {
            minutes: 59,
            hours: 12,
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const timeResult = {
      activityItem: {
        id: '6c50d1fa-05f1-4f18-af43-1e568ab9bb0e',
        name: 'time_extraText',
        question: {
          en: 'Time question',
        },
        responseType: 'time',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const numberSelectionProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Number selection question',
          },
          responseType: 'numberSelect',
          responseValues: {
            minValue: 0,
            maxValue: 100,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
          },
          name: 'number_selection_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '4bcb492b-3709-4633-935b-3b45978d0835',
          order: 4,
        },
        answer: {
          value: '40',
        },
        items: [], // skip, no need for the test
      },
    };
    const numberSelectionResult = {
      activityItem: {
        id: '4bcb492b-3709-4633-935b-3b45978d0835',
        name: 'number_selection_extraText',
        question: {
          en: 'Number selection question',
        },
        responseType: 'numberSelect',
        responseValues: {
          maxValue: 100,
          minValue: 0,
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: '40',
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const dateProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'date_item_skippable',
          },
          responseType: 'date',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: true,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'date_item_skippable',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '05a5dac0-02c7-4443-99ed-2b0be9ec3807',
          order: 5,
        },
        answer: {
          value: {
            day: 17,
            month: 3,
            year: 2024,
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const dateResult = {
      activityItem: {
        id: '05a5dac0-02c7-4443-99ed-2b0be9ec3807',
        name: 'date_item_skippable',
        question: {
          en: 'date_item_skippable',
        },
        responseType: 'date',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            value: '17 Mar 2024',
            text: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };

    const drawingProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'drawing_extraText question',
          },
          responseType: 'drawing',
          responseValues: {
            drawingBackground: 'https://path_to_drawingBackground',
            drawingExample: 'https://path_to_drawingExample',
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            timer: 0,
            removeUndoButton: false,
            navigationToTop: false,
          },
          name: 'drawing_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'a2ff06a5-24f4-4bf9-a88a-7f9ec17e3c37',
          order: 11,
        },
        answer: {
          text: 'Test',
          value: {
            svgString: 'svg_string',
            width: 362.7272644042969,
            fileName: '9b977cde-d5ea-4728-a638-da2c091fc033.svg',
            type: 'image/svg',
            uri: 's3://some_path_to_svg',
            lines: [], // skip, no need for the test
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const drawingResult = {
      activityItem: {
        id: 'a2ff06a5-24f4-4bf9-a88a-7f9ec17e3c37',
        name: 'drawing_extraText',
        question: {
          en: 'drawing_extraText question',
        },
        responseType: 'drawing',
        responseValues: {
          drawingBackground: 'https://path_to_drawingBackground',
          drawingExample: 'https://path_to_drawingExample',
        },
      },
      answers: [
        {
          answer: {
            text: null,
            value: null,
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };
    const timeRangeProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Time range question',
          },
          responseType: 'timeRange',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: true,
            additionalResponseOption: {
              textInputOption: true,
              textInputRequired: false,
            },
            timer: 0,
          },
          name: 'time_range_extraText',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'b0d3bd40-745c-4b3e-bfa2-9f27a2f38e7d',
          order: 7,
        },
        answer: {
          value: {
            from: {
              hour: 6,
              minute: 0,
            },
            to: {
              hour: 22,
              minute: 30,
            },
          },
        },
        items: [], // skip, no need for the test
      },
    };
    const timeRangeResult = {
      activityItem: {
        id: 'b0d3bd40-745c-4b3e-bfa2-9f27a2f38e7d',
        name: 'time_range_extraText',
        question: {
          en: 'Time range question',
        },
        responseType: 'timeRange',
        responseValues: null,
      },
      answers: [
        {
          answer: {
            text: null,
            value: {
              from: '06:00',
              to: '22:30',
            },
          },
          date: '2024-03-14T10:03:01.345000',
        },
      ],
    };
    const singleSelectionPerRowProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Single Select Rows Question.',
          },
          responseType: 'singleSelectRows',
          responseValues: {
            rows: [
              {
                id: 'c4995e02-c2fd-43a2-8654-c659fe2ea40a',
                rowName: 'Work!',
              },
              {
                id: '72bc51d0-dcb1-422b-ab1a-dc324b4dc3ff',
                rowName: 'Gym/Sport',
              },
              {
                id: 'f06808a5-6334-43d8-b001-d52f733d8df4',
                rowName: 'Reading',
              },
              {
                id: '265d6f7d-b8a7-4205-89c7-14cad3868df2',
                rowName: 'Learning',
              },
            ],
            options: [
              {
                id: 'e896b43c-7f31-477f-8c3b-0e360253acd9',
                text: 'Morning',
              },
              {
                id: 'a79b2ffb-1c4c-4814-9031-002230fe1e4c',
                text: 'Afternoon',
              },
              {
                id: '93b5b0c2-b488-4487-b8c3-6d6b3bc17e55',
                text: 'Evening',
              },
            ],
            dataMatrix: null,
          },
          name: 'single-select-rows',
          id: 'd3beb2aa-5d92-4ab7-8c4d-92cebd022a9f',
          order: 4,
        },
        answer: {
          value: ['Afternoon', 'Morning', 'Evening', 'Afternoon'],
        },
        items: [], // skip, no need for the test
      },
    };
    const singleSelectionPerRowResult = {
      activityItem: {
        id: 'd3beb2aa-5d92-4ab7-8c4d-92cebd022a9f',
        name: 'single-select-rows',
        question: { en: 'Single Select Rows Question.' },
        responseType: 'singleSelectRows',
        responseValues: {
          dataMatrix: null,
          options: [
            {
              id: 'e896b43c-7f31-477f-8c3b-0e360253acd9',
              text: 'Morning',
            },
            {
              id: 'a79b2ffb-1c4c-4814-9031-002230fe1e4c',
              text: 'Afternoon',
            },
            {
              id: '93b5b0c2-b488-4487-b8c3-6d6b3bc17e55',
              text: 'Evening',
            },
          ],
          rows: [
            { id: 'c4995e02-c2fd-43a2-8654-c659fe2ea40a', rowName: 'Work!' },
            { id: '72bc51d0-dcb1-422b-ab1a-dc324b4dc3ff', rowName: 'Gym/Sport' },
            { id: 'f06808a5-6334-43d8-b001-d52f733d8df4', rowName: 'Reading' },
            { id: '265d6f7d-b8a7-4205-89c7-14cad3868df2', rowName: 'Learning' },
          ],
        },
      },
      answers: {
        'Gym/Sport': [
          { answer: { text: null, value: 'Morning' }, date: '2024-03-14T10:03:01.345000' },
        ],
        Learning: [
          { answer: { text: null, value: 'Afternoon' }, date: '2024-03-14T10:03:01.345000' },
        ],
        Reading: [{ answer: { text: null, value: 'Evening' }, date: '2024-03-14T10:03:01.345000' }],
        'Work!': [
          { answer: { text: null, value: 'Afternoon' }, date: '2024-03-14T10:03:01.345000' },
        ],
      },
    };
    const multiSelectionPerRowProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Multi Select Rows Question.',
          },
          responseType: 'multiSelectRows',
          responseValues: {
            rows: [
              {
                id: '315e0b97-ca13-4aa2-a1b0-45758c696bee',
                rowName: 'Row 1',
              },
              {
                id: 'fd5e90ec-0adf-4785-b82b-76adbc117a69',
                rowName: 'Row 2',
              },
              {
                id: '4841e580-e850-48e8-b147-8914dc8b2add',
                rowName: 'Row 3',
              },
            ],
            options: [
              {
                id: '49ed757b-56dc-409d-b0db-e4485fa2eca8',
                text: 'Option 1',
              },
              {
                id: '06c2a948-2f49-46b9-91e6-5f530137c375',
                text: 'Option 2',
              },
              {
                id: '57d4f628-7a84-46b5-8264-18aa5a5527fe',
                text: 'Option 3',
              },
            ],
            dataMatrix: null,
          },

          name: 'multi-select-rows',
          id: '187c7d7e-49e6-4d2b-b70d-551a5a1fef61',
          order: 5,
        },
        answer: {
          value: [['Option 1', 'Option 3'], ['Option 2'], ['Option 1']],
        },
        items: [], // skip, no need for the test
      },
    };
    const multiSelectionPerRowResult = {
      activityItem: {
        id: '187c7d7e-49e6-4d2b-b70d-551a5a1fef61',
        name: 'multi-select-rows',
        question: { en: 'Multi Select Rows Question.' },
        responseType: 'multiSelectRows',
        responseValues: {
          dataMatrix: null,
          options: [
            { id: '49ed757b-56dc-409d-b0db-e4485fa2eca8', text: 'Option 1' },
            { id: '06c2a948-2f49-46b9-91e6-5f530137c375', text: 'Option 2' },
            { id: '57d4f628-7a84-46b5-8264-18aa5a5527fe', text: 'Option 3' },
          ],
          rows: [
            { id: '315e0b97-ca13-4aa2-a1b0-45758c696bee', rowName: 'Row 1' },
            { id: 'fd5e90ec-0adf-4785-b82b-76adbc117a69', rowName: 'Row 2' },
            { id: '4841e580-e850-48e8-b147-8914dc8b2add', rowName: 'Row 3' },
          ],
        },
      },
      answers: {
        'Row 1': [
          { answer: { text: null, value: 'Option 1' }, date: '2024-03-14T10:03:01.345000' },
          { answer: { text: null, value: 'Option 3' }, date: '2024-03-14T10:03:01.345000' },
        ],
        'Row 2': [
          { answer: { text: null, value: 'Option 2' }, date: '2024-03-14T10:03:01.345000' },
        ],
        'Row 3': [
          { answer: { text: null, value: 'Option 1' }, date: '2024-03-14T10:03:01.345000' },
        ],
      },
    };
    const sliderRowsProps = {
      ...sharedProps,
      currentAnswer: {
        activityItem: {
          question: {
            en: 'Slider Rows Question.',
          },
          responseType: 'sliderRows',
          responseValues: {
            rows: [
              {
                id: '315e0b97-ca13-4aa2-a1b0-45758c696bee',
                label: 'Slider Row 1',
                maxValue: 10,
                minValue: 1,
              },
              {
                id: '265d6f7d-b8a7-4205-89c7-14cad3868df2',
                label: 'Slider Row 0',
                maxValue: 5,
                minValue: 0,
              },
            ],
          },

          name: 'slider-rows',
          id: '187c7d7e-49e6-4d2b-b70d-551a5a1fef61',
          order: 5,
        },
        answer: {
          value: [9, 3],
        },
        items: [], // skip, no need for the test
      },
    };

    const sliderRowsResult = {
      activityItem: {
        id: '187c7d7e-49e6-4d2b-b70d-551a5a1fef61',
        name: 'slider-rows',
        question: { en: 'Slider Rows Question.' },
        responseType: 'sliderRows',
        responseValues: {
          rows: [
            {
              id: '315e0b97-ca13-4aa2-a1b0-45758c696bee',
              label: 'Slider Row 1',
              maxValue: 10,
              minValue: 1,
            },
            {
              id: '265d6f7d-b8a7-4205-89c7-14cad3868df2',
              label: 'Slider Row 0',
              maxValue: 5,
              minValue: 0,
            },
          ],
        },
      },
      answers: {
        '265d6f7d-b8a7-4205-89c7-14cad3868df2': [
          { answer: { text: null, value: 3 }, date: '2024-03-14T10:03:01.345000' },
        ],
        '315e0b97-ca13-4aa2-a1b0-45758c696bee': [
          { answer: { text: null, value: 9 }, date: '2024-03-14T10:03:01.345000' },
        ],
      },
    };

    test.each`
      props                         | result                         | description
      ${singleSelectionProps}       | ${singleSelectionResult}       | ${'single selection'}
      ${multipleSelectionProps}     | ${multipleSelectionResult}     | ${'multi selection'}
      ${sliderProps}                | ${sliderResult}                | ${'slider'}
      ${textProps}                  | ${textResult}                  | ${'text'}
      ${timeProps}                  | ${timeResult}                  | ${'time'}
      ${numberSelectionProps}       | ${numberSelectionResult}       | ${'number selection'}
      ${dateProps}                  | ${dateResult}                  | ${'date'}
      ${timeRangeProps}             | ${timeRangeResult}             | ${'time range'}
      ${drawingProps}               | ${drawingResult}               | ${'drawing item'}
      ${singleSelectionPerRowProps} | ${singleSelectionPerRowResult} | ${'single selection per row item'}
      ${multiSelectionPerRowProps}  | ${multiSelectionPerRowResult}  | ${'multi selection per row item'}
      ${sliderRowsProps}            | ${sliderRowsResult}            | ${'slider rows item'}
    `('$description', ({ props, result }) => {
      expect(formatActivityItemAnswers(props.currentAnswer, props.date)).toStrictEqual(result);
    });
  });
});
