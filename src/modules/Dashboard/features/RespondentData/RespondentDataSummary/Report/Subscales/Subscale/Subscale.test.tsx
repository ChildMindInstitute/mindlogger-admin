// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { Subscale } from './Subscale';
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => jest.fn(),
  }),
}));

jest.mock(
  'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/ResponseOptions/ResponseOptions.utils',
  () => ({
    getResponseItem: () => <div data-testid="mocked-chart" />,
  }),
);

jest.mock('../AdditionalInformation', () => ({
  AdditionalInformation: ({ optionText, 'data-testid': dataTestid }) => (
    <div data-testid={dataTestid}>{optionText}</div>
  ),
}));

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  ...jest.requireActual('modules/Dashboard/features/RespondentData/CollapsedMdText'),
  CollapsedMdText: ({ text, 'data-testid': dataTestid }) => (
    <div data-testid={dataTestid}>{text}</div>
  ),
}));

const isNested = false;
const name = 'Average Nested';
const subscale = {
  score: 3.5,
  optionText: '',
  restScores: {
    'Sum 1': {
      items: [
        {
          activityItem: {
            id: 'd088ed7d-8081-4109-bf5e-4ede4ac4df8f',
            name: 'Item1',
            question: {
              en: 'Single Select Item 1',
            },
            responseType: 'singleSelect',
            responseValues: {
              options: [
                {
                  id: '41760003-008d-4faa-8704-ffd2fece1e16',
                  text: 'SS 2',
                  value: 0,
                },
                {
                  id: '3acf3972-f7a5-46b6-ac2d-862f3dad23d2',
                  text: 'SS 1',
                  value: 1,
                },
              ],
            },
          },
          answers: [
            {
              answer: {
                value: 1,
                text: null,
              },
              date: '2024-01-23T13:52:42.156000',
            },
          ],
        },
        {
          activityItem: {
            id: 'e7968b47-a3e0-436e-ac04-e02fc7416b38',
            name: 'Item3',
            question: {
              en: 'Single Select Item 2',
            },
            responseType: 'singleSelect',
            responseValues: {
              options: [
                {
                  id: '3e2cdd62-aab1-488f-9170-d0798bf60c27',
                  text: '2',
                  value: 0,
                },
                {
                  id: 'a728f4be-7c30-474e-942f-cef7a309a0b9',
                  text: '1',
                  value: 1,
                },
              ],
            },
          },
          answers: [
            {
              answer: {
                value: 0,
                text: null,
              },
              date: '2024-01-23T13:52:42.156000',
            },
          ],
        },
      ],
      score: 3,
      optionText: 'Markdown Text Here',
      restScores: {},
    },
    'Sum 2': {
      items: [
        {
          activityItem: {
            id: 'aa30fd29-6314-4726-8f1d-0dd0f135c453',
            name: 'Item2',
            question: {
              en: 'Multi Select Item',
            },
            responseType: 'multiSelect',
            responseValues: {
              options: [
                {
                  id: '3d0bd71f-7002-40ae-a4e6-3e17cbb645d8',
                  text: 'MS 2',
                  value: 0,
                },
                {
                  id: '117b21b7-76e7-4b2d-a82d-722725cdbc97',
                  text: 'MS 1',
                  value: 1,
                },
              ],
            },
          },
          answers: [
            {
              answer: {
                value: 0,
                text: null,
              },
              date: '2024-01-23T13:52:42.156000',
            },
          ],
        },
        {
          activityItem: {
            id: '83d001cf-3698-4ad4-adb0-2882e4518c37',
            name: 'Item4',
            question: {
              en: 'Slider Item',
            },
            responseType: 'slider',
            responseValues: {
              options: [
                {
                  id: '83d001cf-3698-4ad4-adb0-2882e4518c37-0',
                  text: 0,
                  value: 0,
                },
                {
                  id: '83d001cf-3698-4ad4-adb0-2882e4518c37-1',
                  text: 1,
                  value: 1,
                },
                {
                  id: '83d001cf-3698-4ad4-adb0-2882e4518c37-2',
                  text: 2,
                  value: 2,
                },
                {
                  id: '83d001cf-3698-4ad4-adb0-2882e4518c37-3',
                  text: 3,
                  value: 3,
                },
                {
                  id: '83d001cf-3698-4ad4-adb0-2882e4518c37-4',
                  text: 4,
                  value: 4,
                },
                {
                  id: '83d001cf-3698-4ad4-adb0-2882e4518c37-5',
                  text: 5,
                  value: 5,
                },
              ],
            },
          },
          answers: [
            {
              answer: {
                value: 2,
                text: null,
              },
              date: '2024-01-23T13:52:42.156000',
            },
          ],
        },
      ],
      score: 4,
      optionText: 'Good',
      restScores: {},
    },
  },
  items: [],
};

describe('Subscale component', () => {
  test('renders component with correct data', async () => {
    const props = {
      isNested,
      name,
      subscale,
      versions: [],
    };
    renderWithProviders(<Subscale {...props} data-testid="subscale" />);

    expect(screen.getByTestId('subscale')).toBeInTheDocument();
    const subscaleTitle = screen.getByText('Average Nested');
    expect(subscaleTitle).toBeInTheDocument();
    expect(screen.getByText('Score: 3.5')).toBeInTheDocument();

    expect(screen.queryAllByTestId(/subscale-nested-\d+$/)).toHaveLength(0);

    await userEvent.click(subscaleTitle);

    expect(screen.queryAllByTestId(/subscale-nested-\d+$/)).toHaveLength(2);

    // Test first nested subscale
    const nestedSubscale0 = screen.getByTestId('subscale-nested-0');
    const withinNestedSubscale0 = within(nestedSubscale0);
    const nestedSubscaleTitle0 = withinNestedSubscale0.getByText('Sum 1');
    expect(nestedSubscaleTitle0).toBeInTheDocument();
    expect(withinNestedSubscale0.getByText('Score: 3')).toBeInTheDocument();

    await userEvent.click(nestedSubscaleTitle0);

    const additionalInformation0 = withinNestedSubscale0.getByTestId(
      'subscale-nested-0-additional-information',
    );
    expect(additionalInformation0).toBeInTheDocument();
    const withinAdditionalInformation0 = within(additionalInformation0);
    expect(withinAdditionalInformation0.getByText('Markdown Text Here')).toBeInTheDocument();
    expect(withinNestedSubscale0.queryAllByTestId(/subscale-nested-0-question-\d+$/)).toHaveLength(
      2,
    );
    expect(withinNestedSubscale0.getByText('Single Select Item 1')).toBeInTheDocument();
    expect(withinNestedSubscale0.getByText('Single Select Item 2')).toBeInTheDocument();

    // Test second nested subscale
    const nestedSubscale1 = screen.getByTestId('subscale-nested-1');
    const withinNestedSubscale1 = within(nestedSubscale1);
    const nestedSubscaleTitle1 = withinNestedSubscale1.getByText('Sum 2');
    expect(nestedSubscaleTitle1).toBeInTheDocument();
    expect(withinNestedSubscale1.getByText('Score: 4')).toBeInTheDocument();

    await userEvent.click(nestedSubscaleTitle1);

    const additionalInformation1 = withinNestedSubscale1.getByTestId(
      'subscale-nested-1-additional-information',
    );
    expect(additionalInformation1).toBeInTheDocument();
    const withinAdditionalInformation1 = within(additionalInformation1);
    expect(withinAdditionalInformation1.getByText('Good')).toBeInTheDocument();
    expect(withinNestedSubscale1.queryAllByTestId(/subscale-nested-1-question-\d+$/)).toHaveLength(
      2,
    );
    expect(withinNestedSubscale1.getByText('Multi Select Item')).toBeInTheDocument();
    expect(withinNestedSubscale1.getByText('Slider Item')).toBeInTheDocument();

    await userEvent.click(subscaleTitle);

    // Collapse subscale
    expect(screen.queryByTestId('subscale-nested-0')).not.toBeInTheDocument();
    expect(screen.queryByTestId('subscale-nested-1')).not.toBeInTheDocument();
  });
});
