import { render, fireEvent, screen } from '@testing-library/react';

import { mockedAppletData } from 'shared/mock';
import { ConditionalLogic } from 'redux/modules';

import { ConditionalPanel } from '.';

const mockedWatch = jest.fn();
const mockedUseParams = jest.fn();

const mockCondition = mockedAppletData.activities[0].items[0].conditionalLogic as ConditionalLogic;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => mockedWatch(),
    setValue: () => jest.fn(),
  }),
}));

const renderComponent = () => render(<ConditionalPanel condition={mockCondition} />);

describe('ConditionalPanel', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ activityId: mockedAppletData.activities[0].id });
    mockedWatch.mockReturnValue(mockedAppletData.activities[0].items);
  });

  test('toggles expansion on button click', async () => {
    renderComponent();

    const toggleButton = screen.getByTestId('builder-conditional-panel-btn');
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('builder-conditional-panel-expanded')).toBeNull();
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('builder-conditional-panel-expanded')).toBeVisible();
  });

  test('displays correct data based on condition prop', () => {
    renderComponent();

    mockCondition?.conditions.forEach(condition => {
      expect(screen.getByText(new RegExp(condition.itemName, 'i'))).toBeInTheDocument();
    });
  });
});
