import { render, screen, fireEvent } from '@testing-library/react';

import { AppletWithoutChangesPopup } from './AppletWithoutChangesPopup';

const mockOnClose = jest.fn();

describe('AppletWithoutChangesPopup', () => {
  test('closes when the OK button is clicked', () => {
    render(<AppletWithoutChangesPopup isPopupVisible={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('Ok'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
