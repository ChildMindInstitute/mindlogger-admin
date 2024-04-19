// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { Subscales } from './Subscales';
import { ReportContext } from '../Report.context';

const answers = [
  {
    decryptedAnswer: [
      {
        activityItem: {
          question: {
            en: 'Single Selection',
          },
          responseType: 'singleSelect',
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
          responseType: 'slider',
          responseValues: {
            minValue: 1,
            maxValue: 5,
            scores: [1, 2, 3, 4, 5],
          },
          name: 'Item2',
          id: '140d3fd0-26bb-4f15-a1fd-ed1be7a30605',
          order: 2,
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
      calculateTotalScore: 'sum',
      subscales: [
        {
          name: 'Sum',
          scoring: 'sum',
          items: [
            {
              name: 'Item1',
              type: 'item',
            },
            {
              name: 'Item2',
              type: 'item',
            },
          ],
          subscaleTableData: null,
        },
        {
          name: 'Average',
          scoring: 'average',
          items: [
            {
              name: 'Item1',
              type: 'item',
            },
            {
              name: 'Item2',
              type: 'item',
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
          responseType: 'singleSelect',
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
          responseType: 'slider',
          responseValues: {
            minValue: 1,
            maxValue: 5,
            scores: [1, 2, 3, 4, 5],
          },
          name: 'Item2',
          id: '140d3fd0-26bb-4f15-a1fd-ed1be7a30605',
          order: 2,
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
      calculateTotalScore: 'sum',
      subscales: [
        {
          name: 'Sum',
          scoring: 'sum',
          items: [
            {
              name: 'Item1',
              type: 'item',
            },
            {
              name: 'Item2',
              type: 'item',
            },
          ],
          subscaleTableData: null,
        },
        {
          name: 'Average',
          scoring: 'average',
          items: [
            {
              name: 'Item1',
              type: 'item',
            },
            {
              name: 'Item2',
              type: 'item',
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
  Subscale: ({ 'data-testid': dataTestid }) => <div data-testid={dataTestid} />,
}));

jest.mock('./AllScores', () => ({
  AllScores: () => <div data-testid="all-scores" />,
}));

jest.mock('./ActivityCompletionScores', () => ({
  ActivityCompletionScores: () => <div data-testid="activity-completion-scores" />,
}));

describe('Subscales component', () => {
  test('renders component with correct data', async () => {
    renderWithProviders(
      <ReportContext.Provider
        value={{
          currentActivityCompletionData: false,
        }}
      >
        <Subscales answers={answers} versions={[]} subscalesFrequency={subscalesFrequency} />,
      </ReportContext.Provider>,
    );

    expect(screen.getByTestId('all-scores')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/subscale-\d+$/)).toHaveLength(2);
  });

  test('renders component with correct data', async () => {
    renderWithProviders(
      <ReportContext.Provider
        value={{
          currentActivityCompletionData: {
            answerId: '03f80472-7829-44b0-a900-f93a70459932',
            date: 1706120981932,
          },
        }}
      >
        <Subscales answers={answers} versions={[]} subscalesFrequency={subscalesFrequency} />,
      </ReportContext.Provider>,
    );

    expect(screen.getByTestId('activity-completion-scores')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/subscale-\d+$/)).toHaveLength(2);
  });
});
