// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { MultiSelectResponseItem } from './MultiSelectResponseItem';

const activityItem = {
  question: {
    en: 'Multiple Selection Item',
  },
  responseType: 'multiSelect',
  responseValues: {
    paletteName: null,
    options: [
      {
        id: '0c6a3d68-790d-4ec8-83d5-bdcdea95c969',
        text: 'Option 1',
        isHidden: false,
        value: 0,
      },
      {
        id: '43f36f67-d419-4a84-8017-9a0f3e7172bb',
        text: 'Option 2',
        isHidden: false,
        value: 1,
      },
      {
        id: '4c1770a7-1e0d-4b7c-829b-e2cc8e6b729a',
        text: 'Option 3',
        isHidden: false,
        value: 2,
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
  name: 'Item3',
  isHidden: false,
  allowEdit: true,
  id: '14fc91d4-88b9-4bc6-8883-7b283b972064',
  order: 3,
};

const answer = {
  value: [1, 2],
  text: null,
};

const dataTestid = 'respondents-review-activity-items-response';

describe('MultiSelectResponseItem', () => {
  test('renders multi select item with options correctly', () => {
    renderWithProviders(
      <MultiSelectResponseItem activityItem={activityItem} answer={answer} data-testid={dataTestid} />,
    );

    const item = screen.getByTestId(dataTestid);
    expect(item).toBeInTheDocument();

    const optionLength = screen.queryAllByTestId(/respondents-review-activity-items-response-option-\d+$/);
    expect(optionLength).toHaveLength(3);

    const option1Container = screen.getByTestId(`${dataTestid}-option-0`);
    expect(option1Container).toHaveTextContent('Option 1');
    const input1 = option1Container.querySelector('input') as HTMLInputElement;
    expect(input1).toBeInTheDocument();
    expect(input1).not.toBeChecked();
    expect(input1.value).toEqual('0');

    const option2Container = screen.getByTestId(`${dataTestid}-option-1`);
    expect(option2Container).toHaveTextContent('Option 2');
    const input2 = option2Container.querySelector('input') as HTMLInputElement;
    expect(input2).toBeInTheDocument();
    expect(input2).toBeChecked();
    expect(input2.value).toEqual('1');

    const option3Container = screen.getByTestId(`${dataTestid}-option-2`);
    expect(option3Container).toHaveTextContent('Option 3');
    const input3 = option3Container.querySelector('input') as HTMLInputElement;
    expect(input3).toBeInTheDocument();
    expect(input3).toBeChecked();
    expect(input3.value).toEqual('2');
  });
});
