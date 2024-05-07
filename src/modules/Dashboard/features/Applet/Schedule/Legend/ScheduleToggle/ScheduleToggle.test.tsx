import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ScheduleToggle } from './ScheduleToggle';

const testId = 'test-toggle';

describe('ScheduleToggle', () => {
  describe('When `isIndividual` is true', () => {
    describe('When `disabled` is true', () => {
      beforeEach(() => {
        renderWithProviders(<ScheduleToggle disabled data-testid={testId} isIndividual />);
      });

      test('Should render', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).toBeInTheDocument();
      });

      test('Should be disabled', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).toHaveAttribute('disabled');
      });

      test('Should not open a modal', async () => {
        const toggle = screen.getByTestId(testId);

        expect(() => userEvent.click(toggle)).rejects.toThrow();
        expect(screen.queryByTestId(`${testId}-remove-popup`)).not.toBeInTheDocument();
      });
    });

    describe('When the toggle is enabled', () => {
      beforeEach(() => {
        renderWithProviders(<ScheduleToggle data-testid={testId} isIndividual />);
      });

      test('Should render', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).toBeInTheDocument();
      });

      test('Should not be disabled', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).not.toHaveAttribute('disabled');
      });

      test('Should open a modal', async () => {
        const toggle = screen.getByTestId(testId);

        await userEvent.click(toggle);

        expect(screen.queryByTestId(`${testId}-remove-popup`)).toBeInTheDocument();
      });
    });
  });

  describe('When `isIndividual` is false', () => {
    describe('When `disabled` is true', () => {
      beforeEach(() => {
        renderWithProviders(<ScheduleToggle disabled data-testid={testId} />);
      });

      test('Should render', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).toBeInTheDocument();
      });

      test('Should be disabled', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).toHaveAttribute('disabled');
      });

      test('Should not open a modal', async () => {
        const toggle = screen.getByTestId(testId);

        expect(() => userEvent.click(toggle)).rejects.toThrow();
        expect(screen.queryByTestId(`${testId}-add-popup`)).not.toBeInTheDocument();
      });
    });

    describe('When the toggle is enabled', () => {
      beforeEach(() => {
        renderWithProviders(<ScheduleToggle data-testid={testId} />);
      });

      test('Should render', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).toBeInTheDocument();
      });

      test('Should not be disabled', () => {
        const toggle = screen.getByTestId(testId);
        expect(toggle).not.toHaveAttribute('disabled');
      });

      test('Should open a modal', async () => {
        const toggle = screen.getByTestId(testId);

        await userEvent.click(toggle);

        expect(screen.queryByTestId(`${testId}-add-popup`)).toBeInTheDocument();
      });
    });
  });
});
