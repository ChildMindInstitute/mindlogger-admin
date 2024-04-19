import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RemoveAudioPopup } from './RemoveAudioPopup';
import { removeAudioPopupDataTestid } from './RemoveAudioPopup.const';

const mockOnClose = jest.fn();
const mockOnRemove = jest.fn();

describe('RemoveAudioPopup', () => {
  test('test popup with button clicks', async () => {
    renderWithProviders(
      <RemoveAudioPopup open={true} onClose={mockOnClose} onRemove={mockOnRemove} />,
    );

    expect(screen.getByTestId(removeAudioPopupDataTestid)).toBeInTheDocument();
    expect(screen.getByTestId(`${removeAudioPopupDataTestid}-title`)).toHaveTextContent(
      'Delete Audio',
    );
    expect(screen.getByTestId(`${removeAudioPopupDataTestid}-description`)).toHaveTextContent(
      'Are you sure you want to delete the current audio?',
    );

    const closeButton = screen.getByTestId(`${removeAudioPopupDataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();

    const cancelButton = screen.getByTestId(`${removeAudioPopupDataTestid}-secondary-button`);
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();

    const deleteButton = screen.getByTestId(`${removeAudioPopupDataTestid}-submit-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveTextContent('Delete');
    await userEvent.click(deleteButton);
    expect(mockOnRemove).toHaveBeenCalled();
  });
});
