import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ChangeScoreConditionIdPopup } from './ChangeScoreConditionIdPopup';

const onCloseMock = jest.fn();
const onChangeMock = jest.fn();

describe('ChangeScoreConditionIdPopup', () => {
  test('should change scoreConditionId', () => {
    const dataTestid = 'change-score-condition-id-popup';
    renderWithProviders(
      <ChangeScoreConditionIdPopup
        onClose={onCloseMock}
        onChange={onChangeMock}
        data-testid={dataTestid}
      />,
    );

    expect(
      screen.getByText(
        'You are referencing this score condition as a variable in the markdown. Changing the Score Condition ID will cause the variable names to update everywhere.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Change'));

    expect(onChangeMock).toBeCalled();
    expect(
      screen.getByText('Score Condition ID has been changed successfully.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
