import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ChangeScoreIdPopup } from './ChangeScoreIdPopup';

const onCloseMock = vi.fn();
const onChangeMock = vi.fn();

describe('ChangeScoreIdPopup', () => {
  test('should change scoreId', () => {
    const dataTestid = 'change-score-id-popup';
    renderWithProviders(
      <ChangeScoreIdPopup onClose={onCloseMock} onChange={onChangeMock} data-testid={dataTestid} />,
    );

    expect(
      screen.getByText(
        'You are referencing this score as a variable in the markdown. Changing the Score ID will cause the variable names to update everywhere.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Change'));

    expect(onChangeMock).toBeCalled();
    expect(screen.getByText('Score ID has been changed successfully.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ok'));

    expect(onCloseMock).toBeCalled();
  });
});
