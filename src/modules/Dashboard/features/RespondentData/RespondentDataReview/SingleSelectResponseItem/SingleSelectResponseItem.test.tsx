// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { SingleSelectResponseItem } from './SingleSelectResponseItem';

const activityItem = {
  question: {
    en: 'Your age:',
  },
  responseType: 'singleSelect',
  responseValues: {
    paletteName: null,
    options: [
      {
        id: 'c6dfd6d3-bbe2-4c15-8382-eadb96a35eb3',
        text: '12-18',
        isHidden: false,
        value: 0,
      },
      {
        id: '1fa0140e-f7c9-4206-b2bb-ca726b41f816',
        text: '19-27',
        isHidden: false,
        value: 1,
      },
      {
        id: '28ed9d1f-2636-4e2c-8b88-d7b2178f9f97',
        text: '27+',
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
  name: 'Item1',
  isHidden: false,
  allowEdit: true,
  id: 'acd31ca4-3347-4c8f-987d-99548ba9ae5e',
  order: 1,
};

const answer = {
  value: 2,
  text: null,
};
const dataTestid = 'respondents-review-activity-items-response';

describe('SingleSelectResponseItem', () => {
  test('renders single select item with options correctly', () => {
    renderWithProviders(
      <SingleSelectResponseItem
        activityItem={activityItem}
        answer={answer}
        data-testid={dataTestid}
      />,
    );

    const item = screen.getByTestId(dataTestid);
    expect(item).toBeInTheDocument();

    const optionLength = screen.queryAllByTestId(
      /respondents-review-activity-items-response-option-\d+$/,
    );
    expect(optionLength).toHaveLength(3);

    const option1Container = screen.getByTestId(`${dataTestid}-option-0`);
    expect(option1Container).toHaveTextContent('12-18');
    const input1 = option1Container.querySelector('input') as HTMLInputElement;
    expect(input1).toBeInTheDocument();
    expect(input1).not.toBeChecked();
    expect(input1.value).toEqual('0');

    const option2Container = screen.getByTestId(`${dataTestid}-option-1`);
    expect(option2Container).toHaveTextContent('19-27');
    const input2 = option2Container.querySelector('input') as HTMLInputElement;
    expect(input2).toBeInTheDocument();
    expect(input2).not.toBeChecked();
    expect(input2.value).toEqual('1');

    const option3Container = screen.getByTestId(`${dataTestid}-option-2`);
    expect(option3Container).toHaveTextContent('27+');
    const input3 = option3Container.querySelector('input') as HTMLInputElement;
    expect(input3).toBeInTheDocument();
    expect(input3).toBeChecked();
    expect(input3.value).toEqual('2');
  });
});
