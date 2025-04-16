import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SaveChangesPopup } from './SaveChangesPopup';

const dataTestid = 'save-changes-popup';

describe('SaveChangesPopup', () => {
  test('renders the popup correctly', async () => {
    const handleClose = vi.fn();
    const handleDoNotSaveSubmit = vi.fn();
    const handleSaveSubmit = vi.fn();

    renderWithProviders(
      <SaveChangesPopup
        isPopupVisible={true}
        handleClose={handleClose}
        handleDoNotSaveSubmit={handleDoNotSaveSubmit}
        handleSaveSubmit={handleSaveSubmit}
        data-testid={dataTestid}
      />,
    );
    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(screen.getByText('Save Changes?')).toBeInTheDocument();
    expect(screen.getByText('Unsaved changes will be lost.')).toBeInTheDocument();

    const thirdButton = screen.getByTestId(`${dataTestid}-third-button`);
    expect(thirdButton).toBeInTheDocument();
    expect(thirdButton).toHaveTextContent('Cancel');
    await userEvent.click(thirdButton);
    expect(handleClose).toHaveBeenCalled();

    const secondaryButton = screen.getByTestId(`${dataTestid}-secondary-button`);
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent("Don't Save");
    await userEvent.click(secondaryButton);
    expect(handleDoNotSaveSubmit).toHaveBeenCalled();

    const submitButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Save');
    await userEvent.click(submitButton);
    expect(handleSaveSubmit).toHaveBeenCalled();
  });
});
