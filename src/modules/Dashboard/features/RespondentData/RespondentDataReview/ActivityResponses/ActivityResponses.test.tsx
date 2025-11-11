// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ActivityResponses } from './ActivityResponses';

const dataTestid = 'review-items';
const activityAnswers = [
  {
    activityItem: {
      question: {
        en: 'Your age:',
      },
      responseType: 'singleSelect',
      responseValues: {
        options: [
          {
            id: '5bab309e-3afc-4dde-b8c1-d43f3c05649d',
            text: '12-18',
            isHidden: false,
            value: 0,
          },
          {
            id: '54f66d09-26be-40b4-b46d-e5b36cc2ece5',
            text: '19-26',
            isHidden: false,
            value: 1,
          },
          {
            id: 'b0f1bc74-0a26-44ad-bb2f-23c94a039410',
            text: '27-34',
            isHidden: false,
            value: 2,
          },
          {
            id: '8f4e0d40-fd92-45c5-b064-06619af73d66',
            text: '35+',
            isHidden: false,
            value: 3,
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
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      name: 'Item1',
      isHidden: false,
      allowEdit: true,
      id: 'febf61fb-6997-4c00-bcf6-fb9324abca39',
      order: 1,
    },
    answer: {
      value: 2,
      text: null,
    },
  },
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
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        addScores: false,
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
      allowEdit: true,
      id: '01f6060e-94ae-4c34-b1f9-cf8a90e2ee7a',
      order: 2,
    },
    answer: {
      value: 4,
      text: null,
    },
  },
  {
    activityItem: {
      question: {
        en: 'What is your name?',
      },
      responseType: 'text',
      config: {
        removeBackButton: false,
        skippableItem: false,
        maxResponseLength: 72,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: false,
        responseDataIdentifier: true,
        responseRequired: false,
      },
      name: 'Item3',
      isHidden: false,
      allowEdit: true,
      id: 'e8fc48d9-1ae2-4247-b2a6-afa0d4705937',
      order: 2,
    },
    answer: 'Jane Doe',
  },
  {
    activityItem: {
      question: {
        en: 'Item: Time Range',
      },
      responseType: 'timeRange',
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 0,
      },
      name: 'Item3',
      isHidden: false,
      allowEdit: true,
      id: '7ff0f546-348b-43ef-8702-8beb0b57e5e8',
      order: 3,
    },
    answer: {
      value: {
        from: {
          hour: 23,
          minute: 10,
        },
        to: {
          hour: 7,
          minute: 0,
        },
      },
    },
  },
  {
    activityItem: {
      question: {
        en: 'audio_player_extraText question',
      },
      responseType: 'audioPlayer',
      responseValues: {
        file: 'https://somepathtofile.mp3',
      },
      config: {
        removeBackButton: false,
        skippableItem: true,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        playOnce: false,
      },
      name: 'audio_player_extraText',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '992b6bbf-b7ef-404c-9d2d-c997f770b3e0',
      order: 18,
    },
    answer: null,
  },
];

vi.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
    CollapsedMdText: ({ text }) => <div data-testid="mock-collapsed-md-text">{text}</div>,
  };
});

describe('ActivityResponses', () => {
  test('renders component with activity answers', () => {
    renderWithProviders(
      <ActivityResponses activityAnswers={activityAnswers} data-testid={dataTestid} />,
    );

    const items = screen.queryAllByTestId(/review-items-\d+$/);
    expect(items).toHaveLength(5);

    expect(screen.getByText('Your age:')).toBeInTheDocument();
    expect(screen.getByText('How did you sleep last night?')).toBeInTheDocument();
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
    expect(screen.getByText('Item: Time Range')).toBeInTheDocument();
    expect(screen.getByText('audio_player_extraText question')).toBeInTheDocument();

    // test single selection item
    const item1 = screen.getByTestId(`${dataTestid}-0`);
    const inputsInsideItem1 = item1.querySelectorAll('input');
    expect(inputsInsideItem1).toHaveLength(4);

    expect(screen.getByText('12-18')).toBeInTheDocument();
    expect(screen.getByText('19-26')).toBeInTheDocument();
    expect(screen.getByText('27-34')).toBeInTheDocument();
    expect(screen.getByText('35+')).toBeInTheDocument();

    const selectedOption = screen.getByTestId(`${dataTestid}-0`).querySelector('input[value="2"]');

    expect(selectedOption).toBeInTheDocument();
    expect(selectedOption).toHaveAttribute('checked');

    // test slider item
    const item2 = screen.getByTestId(`${dataTestid}-1`);
    const sliderInsideItem2 = item2.querySelector('input');

    const minValue = +sliderInsideItem2.getAttribute('min');
    const maxValue = +sliderInsideItem2.getAttribute('max');
    const value = +sliderInsideItem2.getAttribute('value');

    expect(minValue).toEqual(0);
    expect(maxValue).toEqual(5);
    expect(value).toEqual(4);

    // test text item
    const item3 = screen.getByTestId(`${dataTestid}-2`);
    expect(item3).toHaveTextContent('Jane Doe');

    // test time range item
    const item4 = screen.getByTestId(`${dataTestid}-3`);
    expect(item4).toHaveTextContent('Item: Time Range');

    // test unsupported audio player item
    const item5 = screen.getByTestId(`${dataTestid}-4`);
    expect(item5).toHaveTextContent('This data type can’t be displayed on this page');
  });
});
