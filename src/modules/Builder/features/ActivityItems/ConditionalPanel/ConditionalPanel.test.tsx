import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { mockedAppletData } from 'shared/mock';
import { ConditionalLogic } from 'redux/modules';

import { ConditionalPanel } from '.';

const mockedWatch = vi.fn();
const mockedUseParams = vi.fn();

const mockCondition = mockedAppletData.activities[0].items[0].conditionalLogic as ConditionalLogic;

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: () => mockedUseParams,
  };
});

vi.mock('react-hook-form', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-hook-form')>('react-hook-form');

  return {
    ...actual,
    useFormContext: () => ({
      watch: (path: string | undefined) => {
        if (path && path.endsWith('.items')) {
          return mockedWatch();
        }

        return undefined;
      },
      setValue: () => vi.fn(),
    }),
  };
});

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

    mockCondition?.conditions.forEach((condition) => {
      expect(screen.getByText(new RegExp(condition.itemName, 'i'))).toBeInTheDocument();
    });
  });
});
