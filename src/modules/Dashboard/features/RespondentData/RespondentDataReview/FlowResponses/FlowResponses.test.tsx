// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { FlowResponses } from './FlowResponses';

const dataTestid = 'review-flow';
const flowAnswers = [
  {
    activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
    activityName: 'Activity__1',
    answers: [
      {
        activityItem: {
          question: {
            en: 'Your age:',
          },
          responseType: 'singleSelect',
          responseValues: {
            type: 'singleSelect',
            paletteName: null,
            options: [
              {
                id: 'de1d3ce9-93ff-45ce-95f4-c6cc2759b20e',
                text: '12-40',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
              },
              {
                id: '39288a6a-78b9-4982-90bd-0c949b9fca92',
                text: '41-90',
                image: null,
                score: null,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
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
              textInputOption: false,
              textInputRequired: false,
            },
            type: 'singleSelect',
            autoAdvance: false,
          },
          name: 'Item1',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: 'e9247f7c-b588-4f81-a59c-286e54313273',
          idVersion: 'e9247f7c-b588-4f81-a59c-286e54313273_4.8.6',
          activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
          order: 1,
        },
        answer: {
          value: 1,
          text: null,
        },
        id: 'c9e3d9e7-e4ba-42c6-955f-d214926fc212',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
        activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: 'a29c7fe6a4062d198a1e702dafee75be:2b05695ce3bd828c7c64479409130cd8',
        endDatetime: '2024-04-26T10:36:37.020000',
        createdAt: '2024-04-26T10:36:37.020000',
        items: [],
      },
      {
        activityItem: {
          question: {
            en: 'How did you sleep last night?',
          },
          responseType: 'numberSelect',
          responseValues: {
            type: 'numberSelect',
            minValue: 0,
            maxValue: 1,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            type: 'numberSelect',
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
          name: 'Item2',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '1df5abf0-bf96-462e-945d-92879176829e',
          idVersion: '1df5abf0-bf96-462e-945d-92879176829e_4.8.6',
          activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
          order: 2,
        },
        answer: {
          value: 1,
          text: null,
        },
        id: 'c9e3d9e7-e4ba-42c6-955f-d214926fc212',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
        activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: 'a29c7fe6a4062d198a1e702dafee75be:2b05695ce3bd828c7c64479409130cd8',
        endDatetime: '2024-04-26T10:36:37.020000',
        createdAt: '2024-04-26T10:36:37.020000',
        items: [],
      },
      {
        activityItem: {
          question: {
            en: 'About what time did you go to bed last night?',
          },
          responseType: 'time',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            timer: 0,
            type: 'time',
          },
          name: 'Item3',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '2d096af6-c614-4276-9bae-5559dbe865ba',
          idVersion: '2d096af6-c614-4276-9bae-5559dbe865ba_4.8.6',
          activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
          order: 3,
        },
        answer: {
          value: {
            hours: 14,
            minutes: 10,
          },
          text: null,
        },
        id: 'c9e3d9e7-e4ba-42c6-955f-d214926fc212',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: '618e0577-6f99-45d9-a73b-398d8bbabaf5_4.8.6',
        activityId: '618e0577-6f99-45d9-a73b-398d8bbabaf5',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: 'a29c7fe6a4062d198a1e702dafee75be:2b05695ce3bd828c7c64479409130cd8',
        endDatetime: '2024-04-26T10:36:37.020000',
        createdAt: '2024-04-26T10:36:37.020000',
        items: [],
      },
    ],
  },
  {
    activityId: 'af98ef94-7e2d-40aa-bb84-3c619a55b20b',
    activityName: 'Activity__3',
    answers: [
      {
        activityItem: {
          question: {
            en: 'Text Item',
          },
          responseType: 'text',
          responseValues: null,
          config: {
            removeBackButton: false,
            skippableItem: false,
            type: 'text',
            maxResponseLength: 300,
            correctAnswerRequired: false,
            correctAnswer: '',
            numericalResponseRequired: false,
            responseDataIdentifier: false,
            responseRequired: false,
            isIdentifier: null,
          },
          name: 'Item5',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '6f8a9fa6-e475-402b-a66e-bacc747d5689',
          idVersion: '6f8a9fa6-e475-402b-a66e-bacc747d5689_4.8.6',
          activityId: 'af98ef94-7e2d-40aa-bb84-3c619a55b20b_4.8.6',
          order: 2,
        },
        answer: 'some text answer',
        id: 'e92fec5e-ace0-46b0-8860-23ad83247a28',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: 'af98ef94-7e2d-40aa-bb84-3c619a55b20b_4.8.6',
        activityId: 'af98ef94-7e2d-40aa-bb84-3c619a55b20b',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: null,
        endDatetime: '2024-04-26T10:36:47.282000',
        createdAt: '2024-04-26T10:36:47.282000',
        items: [],
      },
    ],
  },
  {
    activityId: '48bcf241-a596-4ada-940e-1e220205421f',
    activityName: 'Activity__2',
    answers: [
      {
        activityItem: {
          question: {
            en: 'How did you sleep last night?',
          },
          responseType: 'slider',
          responseValues: {
            minLabel: 'Bad',
            maxLabel: 'Good',
            minValue: 0,
            maxValue: 5,
            minImage: null,
            maxImage: null,
            scores: [1, 2, 3, 4, 5, 6],
            alerts: null,
            type: 'slider',
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            type: 'slider',
            addScores: true,
            setAlerts: false,
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
            showTickMarks: true,
            showTickLabels: true,
            continuousSlider: false,
            timer: 0,
          },
          name: 'Item2',
          isHidden: false,
          conditionalLogic: {
            match: 'all',
            conditions: [
              {
                itemName: 'Item1',
                type: 'EQUAL_TO_OPTION',
                payload: {
                  optionValue: '1',
                },
              },
              {
                itemName: 'Item2',
                type: 'LESS_THAN',
                payload: {
                  value: 4,
                },
              },
            ],
          },
          allowEdit: true,
          id: '792933c5-cfa4-4a87-a997-8c504344d8f5',
          idVersion: '792933c5-cfa4-4a87-a997-8c504344d8f5_4.8.6',
          activityId: '48bcf241-a596-4ada-940e-1e220205421f_4.8.6',
          order: 2,
        },
        answer: null,
        id: '171cda30-c7f7-4d88-9978-29d35b7dc625',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: '48bcf241-a596-4ada-940e-1e220205421f_4.8.6',
        activityId: '48bcf241-a596-4ada-940e-1e220205421f',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: '84e1ef944acb533fcbe9ff8ed36b4169:b8682450777438d11968f83ec0d4034e',
        endDatetime: '2024-04-26T10:37:08.260000',
        createdAt: '2024-04-26T10:37:08.260000',
        items: [],
      },
      {
        activityItem: {
          question: {
            en: 'Multiple Selection Item',
          },
          responseType: 'multiSelect',
          responseValues: {
            type: 'multiSelect',
            paletteName: null,
            options: [
              {
                id: '1169a1c4-cb51-4fa8-8868-0007c750b370',
                text: 'Option 1',
                image: null,
                score: 2,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 0,
                isNoneAbove: false,
              },
              {
                id: '0d53d939-26c3-44e6-9d4b-e40a04859cf8',
                text: 'Option 2',
                image: null,
                score: 4,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 1,
                isNoneAbove: false,
              },
              {
                id: '722e7d9a-6364-464a-8989-695663d7a5ba',
                text: 'Option 3',
                image: null,
                score: 5,
                tooltip: null,
                isHidden: false,
                color: null,
                alert: null,
                value: 2,
                isNoneAbove: false,
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
              textInputOption: false,
              textInputRequired: false,
            },
            type: 'multiSelect',
          },
          name: 'Item3',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '7e60197c-7778-4a04-80bb-f1864bf22a6a',
          idVersion: '7e60197c-7778-4a04-80bb-f1864bf22a6a_4.8.6',
          activityId: '48bcf241-a596-4ada-940e-1e220205421f_4.8.6',
          order: 3,
        },
        answer: {
          value: [2],
          text: null,
        },
        id: '171cda30-c7f7-4d88-9978-29d35b7dc625',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: '48bcf241-a596-4ada-940e-1e220205421f_4.8.6',
        activityId: '48bcf241-a596-4ada-940e-1e220205421f',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: '84e1ef944acb533fcbe9ff8ed36b4169:b8682450777438d11968f83ec0d4034e',
        endDatetime: '2024-04-26T10:37:08.260000',
        createdAt: '2024-04-26T10:37:08.260000',
        items: [],
      },
      {
        activityItem: {
          question: {
            en: 'Number Selection Item',
          },
          responseType: 'numberSelect',
          responseValues: {
            type: 'numberSelect',
            minValue: 1,
            maxValue: 10,
          },
          config: {
            removeBackButton: false,
            skippableItem: false,
            type: 'numberSelect',
            additionalResponseOption: {
              textInputOption: false,
              textInputRequired: false,
            },
          },
          name: 'Item4',
          isHidden: false,
          conditionalLogic: null,
          allowEdit: true,
          id: '384214d0-0454-415f-9e4e-ccb317637455',
          idVersion: '384214d0-0454-415f-9e4e-ccb317637455_4.8.6',
          activityId: '48bcf241-a596-4ada-940e-1e220205421f_4.8.6',
          order: 4,
        },
        answer: {
          value: 5,
          text: null,
        },
        id: '171cda30-c7f7-4d88-9978-29d35b7dc625',
        submitId: 'ff052cfc-3d56-4a76-b10b-e5be34f6a27f',
        version: '4.8.6',
        activityHistoryId: '48bcf241-a596-4ada-940e-1e220205421f_4.8.6',
        activityId: '48bcf241-a596-4ada-940e-1e220205421f',
        flowHistoryId: '44e5dfc7-2a94-480b-8bf6-1f0177bb0127_4.8.6',
        identifier: '84e1ef944acb533fcbe9ff8ed36b4169:b8682450777438d11968f83ec0d4034e',
        endDatetime: '2024-04-26T10:37:08.260000',
        createdAt: '2024-04-26T10:37:08.260000',
        items: [],
      },
    ],
  },
];

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  ...jest.requireActual('modules/Dashboard/features/RespondentData/CollapsedMdText'),
  CollapsedMdText: ({ text }) => <div data-testid="mock-collapsed-md-text">{text}</div>,
}));

describe('FlowResponses', () => {
  test('renders component with flow answers', () => {
    renderWithProviders(<FlowResponses flowAnswers={flowAnswers} data-testid={dataTestid} />);

    const activities = screen.queryAllByTestId(/review-flow-\d+$/);
    expect(activities).toHaveLength(3);

    expect(screen.getByText('Activity__1')).toBeInTheDocument();
    expect(screen.getByText('Activity__3')).toBeInTheDocument();
    expect(screen.getByText('Activity__2')).toBeInTheDocument();

    // test Activity__1 responses
    const activity1 = screen.getByTestId('review-flow-0');
    expect(activity1).toBeInTheDocument();

    const activity1Items = within(activity1).queryAllByTestId(/review-flow-items-\d+$/);
    expect(activity1Items).toHaveLength(3);

    expect(within(activity1).getByText('Your age:')).toBeInTheDocument();
    expect(within(activity1).getByText('How did you sleep last night?')).toBeInTheDocument();
    expect(
      within(activity1).getByText('About what time did you go to bed last night?'),
    ).toBeInTheDocument();

    // test Activity__3 responses
    const activity2 = screen.getByTestId('review-flow-1');
    expect(activity2).toBeInTheDocument();

    const activity2Items = within(activity2).queryAllByTestId(/review-flow-items-\d+$/);
    expect(activity2Items).toHaveLength(1);

    expect(within(activity2).getByText('Text Item')).toBeInTheDocument();

    // test Activity__2 responses
    const activity3 = screen.getByTestId('review-flow-2');
    expect(activity3).toBeInTheDocument();

    const activity3Items = within(activity3).queryAllByTestId(/review-flow-items-\d+$/);
    expect(activity3Items).toHaveLength(3);

    expect(within(activity3).getByText('How did you sleep last night?')).toBeInTheDocument();
    expect(within(activity3).getByText('Multiple Selection Item')).toBeInTheDocument();
    expect(within(activity3).getByText('Number Selection Item')).toBeInTheDocument();
  });
});
