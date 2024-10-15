import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { ItemResponseType, SubscaleTotalScore } from 'shared/consts';
import {
  defaultSingleSelectionConfig,
  defaultSliderConfig,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration/OptionalItemsAndSettings/OptionalItemsAndSettings.const';
import { ElementType } from 'shared/types';
import { nullReturnFunc } from 'shared/utils';

import { Subscales } from './Subscales';
import { ReportContext } from '../Report.context';
import { ActivityCompletion } from '../../../RespondentData.types';

const answers: ActivityCompletion[] = [
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'Single Selection',
          },
          responseType: ItemResponseType.SingleSelection,
          responseValues: {
            options: [
              {
                id: '79aad70f-a4dc-45a6-bfa5-618a32881ace',
                text: 'Option 2',
                score: 2,
                value: 1,
              },
              {
                id: '52ea6332-82b5-4be0-ba28-368ca9484797',
                text: 'Option 1',
                score: 1,
                value: 0,
              },
            ],
          },
          name: 'Item1',
          id: '3a3e6cbd-1d06-4f90-bbde-7ad71e1fbc9b',
          order: 1,
          config: defaultSingleSelectionConfig,
        },
        answer: {
          value: 1,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Slider 1',
          },
          responseType: ItemResponseType.Slider,
          responseValues: {
            minValue: 1,
            maxValue: 5,
            scores: [1, 2, 3, 4, 5],
          },
          name: 'Item2',
          id: '140d3fd0-26bb-4f15-a1fd-ed1be7a30605',
          order: 2,
          config: defaultSliderConfig,
        },
        answer: {
          value: 3,
          text: null,
        },
      },
    ],
    answerId: '03f80472-7829-44b0-a900-f93a70459932',
    version: '2.0.0',
    startDatetime: '2024-01-24T19:29:34.607000',
    endDatetime: '2024-01-24T19:29:41.932000',
    subscaleSetting: {
      calculateTotalScore: SubscaleTotalScore.Sum,
      subscales: [
        {
          name: 'Sum',
          scoring: SubscaleTotalScore.Sum,
          items: [
            {
              name: 'Item1',
              type: ElementType.Item,
            },
            {
              name: 'Item2',
              type: ElementType.Item,
            },
          ],
          subscaleTableData: null,
        },
        {
          name: 'Average',
          scoring: SubscaleTotalScore.Average,
          items: [
            {
              name: 'Item1',
              type: ElementType.Item,
            },
            {
              name: 'Item2',
              type: ElementType.Item,
            },
          ],
          subscaleTableData: null,
        },
      ],
      totalScoresTableData: null,
    },
  },
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'Single Selection',
          },
          responseType: ItemResponseType.SingleSelection,
          responseValues: {
            options: [
              {
                id: '79aad70f-a4dc-45a6-bfa5-618a32881ace',
                text: 'Option 2',
                score: 2,
                value: 1,
              },
              {
                id: '52ea6332-82b5-4be0-ba28-368ca9484797',
                text: 'Option 1',
                score: 1,
                value: 0,
              },
            ],
          },
          name: 'Item1',
          id: '3a3e6cbd-1d06-4f90-bbde-7ad71e1fbc9b',
          order: 1,
          config: defaultSingleSelectionConfig,
        },
        answer: {
          value: 1,
          text: null,
        },
      },
      {
        activityItem: {
          question: {
            en: 'Slider 1',
          },
          responseType: ItemResponseType.Slider,
          responseValues: {
            minValue: 1,
            maxValue: 5,
            scores: [1, 2, 3, 4, 5],
          },
          name: 'Item2',
          id: '140d3fd0-26bb-4f15-a1fd-ed1be7a30605',
          order: 2,
          config: defaultSliderConfig,
        },
        answer: {
          value: 5,
          text: null,
        },
      },
    ],
    answerId: '48840deb-7d8a-4d13-8248-c38ac9b294d7',
    version: '2.0.0',
    startDatetime: '2024-01-24T19:30:23.076000',
    endDatetime: '2024-01-24T19:30:31.181000',
    subscaleSetting: {
      calculateTotalScore: SubscaleTotalScore.Sum,
      subscales: [
        {
          name: 'Sum',
          scoring: SubscaleTotalScore.Sum,
          items: [
            {
              name: 'Item1',
              type: ElementType.Item,
            },
            {
              name: 'Item2',
              type: ElementType.Item,
            },
          ],
          subscaleTableData: null,
        },
        {
          name: 'Average',
          scoring: SubscaleTotalScore.Average,
          items: [
            {
              name: 'Item1',
              type: ElementType.Item,
            },
            {
              name: 'Item2',
              type: ElementType.Item,
            },
          ],
          subscaleTableData: null,
        },
      ],
      totalScoresTableData: null,
    },
  },
];

const subscalesFrequency = answers.length;

jest.mock('./Subscale', () => ({
  Subscale: ({ 'data-testid': dataTestid }: { 'data-testid': string }) => (
    <div data-testid={dataTestid} />
  ),
}));

jest.mock('./AllScores', () => ({
  AllScores: () => <div data-testid="all-scores" />,
}));

jest.mock('./ActivityCompletionScores', () => ({
  ActivityCompletionScores: () => <div data-testid="activity-completion-scores" />,
}));

describe('Subscales component', () => {
  test('Correctly renders the AllScores component', async () => {
    renderWithProviders(
      <ReportContext.Provider
        value={{
          currentActivityCompletionData: null,
          setCurrentActivityCompletionData: nullReturnFunc,
        }}
      >
        <Subscales answers={answers} versions={[]} subscalesFrequency={subscalesFrequency} />,
      </ReportContext.Provider>,
    );

    expect(screen.getByTestId('all-scores')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/subscale-\d+$/)).toHaveLength(2);
  });

  test('Correctly renders the ActivityCompletionScores component', async () => {
    renderWithProviders(
      <ReportContext.Provider
        value={{
          currentActivityCompletionData: {
            answerId: answers[0].answerId,
            date: 1706120981932,
          },
          setCurrentActivityCompletionData: nullReturnFunc,
        }}
      >
        <Subscales answers={answers} versions={[]} subscalesFrequency={subscalesFrequency} />,
      </ReportContext.Provider>,
    );

    expect(screen.getByTestId('activity-completion-scores')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/subscale-\d+$/)).toHaveLength(2);
  });
});
