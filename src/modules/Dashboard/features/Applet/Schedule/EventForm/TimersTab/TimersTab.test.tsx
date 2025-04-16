import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { TimerType } from 'modules/Dashboard/api';

import { TimersTab } from './TimersTab';

const dataTestid = 'timers-tab';
const mockWatch = vi.fn();
const mockSetValue = vi.fn();

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: () => mockWatch(),
    setValue: mockSetValue,
  }),
}));

const FormWrapper = () => {
  const methods = useForm({
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <TimersTab data-testid={dataTestid} />
    </FormProvider>
  );
};

describe('TimersTab component', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  test('render TimersTab component, TimerType = NotSet', async () => {
    mockWatch.mockReturnValue(TimerType.NotSet);

    renderWithProviders(<FormWrapper />);

    expect(screen.getByText('Set time limit')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-timer-type`)).toBeInTheDocument();

    const tabsRegex = new RegExp(`${dataTestid}-timer-type-\\d+$`);
    expect(screen.queryAllByTestId(tabsRegex)).toHaveLength(3);

    const activeButton = screen.getByTestId(`${dataTestid}-timer-type-0`);
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
    expect(activeButton).toHaveValue(TimerType.NotSet);
    expect(activeButton).toHaveTextContent('No time limit');

    const icon = document.querySelector(`[data-testid="${dataTestid}-timer-type-0"] .svg-check`);
    expect(icon).toBeTruthy();

    const secondButton = screen.getByTestId(`${dataTestid}-timer-type-1`);
    await userEvent.click(secondButton);

    expect(mockSetValue).toBeCalledWith('timerType', TimerType.Timer, { shouldDirty: true });
  });

  test('render TimersTab component, TimerType = Timer', async () => {
    mockWatch.mockReturnValue(TimerType.Timer);

    renderWithProviders(<FormWrapper />);

    const activeButton = screen.getByTestId(`${dataTestid}-timer-type-1`);
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
    expect(activeButton).toHaveValue(TimerType.Timer);
    expect(activeButton).toHaveTextContent('Timer');

    const icon = document.querySelector(`[data-testid="${dataTestid}-timer-type-1"] .svg-check`);
    expect(icon).toBeTruthy();

    expect(screen.getByText('Time to complete the activity:')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-duration`));

    const thirdButton = screen.getByTestId(`${dataTestid}-timer-type-2`);
    await userEvent.click(thirdButton);

    expect(mockSetValue).toBeCalledWith('timerType', TimerType.Idle, { shouldDirty: true });
  });

  test('render TimersTab component, TimerType = Idle', async () => {
    mockWatch.mockReturnValue(TimerType.Idle);

    renderWithProviders(<FormWrapper />);

    const activeButton = screen.getByTestId(`${dataTestid}-timer-type-2`);
    expect(activeButton).toHaveAttribute('aria-pressed', 'true');
    expect(activeButton).toHaveValue(TimerType.Idle);
    expect(activeButton).toHaveTextContent('Idle time');

    const icon = document.querySelector(`[data-testid="${dataTestid}-timer-type-2"] .svg-check`);
    expect(icon).toBeTruthy();

    expect(
      screen.getByText('Maximum time away from the activity before it is automatically submitted:'),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-idle-timer`));

    const firstButton = screen.getByTestId(`${dataTestid}-timer-type-0`);
    await userEvent.click(firstButton);

    expect(mockSetValue).toBeCalledWith('timerType', TimerType.NotSet, { shouldDirty: true });
  });
});
