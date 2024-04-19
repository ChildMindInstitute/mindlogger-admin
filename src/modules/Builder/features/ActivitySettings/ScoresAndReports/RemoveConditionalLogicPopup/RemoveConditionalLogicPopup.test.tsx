import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RemoveConditionalLogicPopup } from './RemoveConditionalLogicPopup';

jest.mock('modules/Builder/hooks', () => ({
  useCustomFormContext: () => ({
    watch: () => 'The score name',
  }),
}));

const onCloseMock = jest.fn();
const onRemoveMock = jest.fn();

describe('RemoveConditionalLogicPopup', () => {
  test('should remove conditional logic', () => {
    const dataTestid = 'remove-conditional-logic-popup';
    renderWithProviders(
      <RemoveConditionalLogicPopup
        name="score1:"
        onClose={onCloseMock}
        data-testid={dataTestid}
        onRemove={onRemoveMock}
        reportFieldName="score1Name"
      />,
    );

    expect(screen.getByTestId(dataTestid)).toHaveTextContent(
      'Are you sure you want to remove conditional logic for the score1: The score name?',
    );

    fireEvent.click(screen.getByText('Remove'));

    expect(onRemoveMock).toBeCalled();
    expect(
      screen.getByText('Conditional logic has been removed successfully.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
