import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { DeleteStimulusPopup } from './DeleteStimulusPopup';

const onModalCloseMock = vi.fn();
const onModalSubmitMock = vi.fn();
const dataTestid = 'builder-activity-flanker-stimulus-screen-delete-popup';

const commonProps = {
  isOpen: true,
  onModalClose: onModalCloseMock,
  onModalSubmit: onModalSubmitMock,
  imageName: 'imageName',
};

describe('DeleteStimulusPopup component tests', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('DeleteStimulusPopup', async () => {
    renderWithProviders(<DeleteStimulusPopup {...commonProps} />);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(screen.getByText('Delete Stimulus Screen')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete the Stimulus Screen/),
    ).toBeInTheDocument();
    expect(screen.getByText(/You will need to re-upload the Block Sequences./)).toBeInTheDocument();

    const secondaryButton = screen.getByTestId(`${dataTestid}-secondary-button`);
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent('Cancel');
    await userEvent.click(secondaryButton);
    expect(onModalCloseMock).toHaveBeenCalled();

    const submitButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Delete');
    await userEvent.click(submitButton);
    expect(onModalSubmitMock).toHaveBeenCalled();
  });
});
