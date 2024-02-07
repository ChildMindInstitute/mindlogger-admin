// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { mockedAppletFormData, mockedMultiSelectFormValues } from 'shared/mock';
import { renderWithAppletFormData } from 'shared/utils';

import { SelectionOption } from './SelectionOption';

const name = 'activities.0.items.1'; // MultiSelect item
const optionsLength = mockedAppletFormData.activities[0].items[1].responseValues.options.length;
const getFormData = (index = 0, optionProps = { isNoneAbove: false }) => {
  const newOptions = [...mockedMultiSelectFormValues.responseValues.options];
  newOptions.splice(index, 1, {
    ...mockedMultiSelectFormValues.responseValues.options[index],
    ...optionProps,
  });
  const newMultiSelectFormValues = {
    ...mockedMultiSelectFormValues,
    responseValues: {
      ...mockedMultiSelectFormValues.responseValues,
      options: newOptions,
    },
  };
  const newItems = [...mockedAppletFormData.activities[0].items];
  newItems.splice(1, 1, newMultiSelectFormValues);

  return {
    ...mockedAppletFormData,
    activities: [
      {
        ...mockedAppletFormData.activities[0],
        items: newItems,
      },
    ],
  };
};

describe('SelectionOption', () => {
  const onRemoveOption = jest.fn();
  const onUpdateOption = jest.fn();
  const setOptionsOpen = jest.fn();
  const selectionOptionCollapsedProps = {
    name,
    onRemoveOption,
    onUpdateOption,
    index: 0,
    optionsLength,
    optionsOpen: [false],
    setOptionsOpen,
  };
  const selectionOptionExpandedProps = {
    ...selectionOptionCollapsedProps,
    optionsOpen: [true],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render first regular option collapsed', () => {
    renderWithAppletFormData({
      children: <SelectionOption {...selectionOptionCollapsedProps} />,
      appletFormData: mockedAppletFormData,
    });

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('m1')).toBeInTheDocument();
  });

  test('should render first regular option expanded', () => {
    renderWithAppletFormData({
      children: <SelectionOption {...selectionOptionExpandedProps} />,
      appletFormData: mockedAppletFormData,
    });

    expect(
      screen.queryByDisplayValue(
        'If selected, this option will disable other options, and other options already selected by the respondent will not be submitted.',
      ),
    ).not.toBeInTheDocument();
  });

  test('should render None option collapsed', () => {
    renderWithAppletFormData({
      children: <SelectionOption {...selectionOptionCollapsedProps} />,
      appletFormData: getFormData(0, {
        isNoneAbove: true,
        text: 'text for None option',
      }),
    });

    expect(screen.getByText('“None“ Option')).toBeInTheDocument();
    expect(screen.getByText('text for None option')).toBeInTheDocument();
  });

  test('should render None option expanded', async () => {
    const { debug } = renderWithAppletFormData({
      children: <SelectionOption {...selectionOptionExpandedProps} />,
      appletFormData: getFormData(0, {
        isNoneAbove: true,
        text: 'text for None option',
      }),
    });

    expect(
      await screen.findByText(
        'If selected, this option will disable other options, and other options already selected by the respondent will not be submitted.',
      ),
    ).toBeInTheDocument();
    debug();
  });
});
