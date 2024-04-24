import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { SourceLinkModal } from './SourceLinkModal';

const mockHandleClose = jest.fn();
const mockHandleSubmit = jest.fn();
const dataTestid = 'md-editor-source-link-popup';

const props = {
  title: 'Mock title',
  handleClose: mockHandleClose,
  handleSubmit: mockHandleSubmit,
};

describe('SourceLinkModal', () => {
  test('should render the modal link correctly', async () => {
    renderWithProviders(<SourceLinkModal {...props} />);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockHandleClose).toHaveBeenCalled();

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Mock title');

    const description = screen.getByTestId(`${dataTestid}-description`);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Description');
    const descriptionInput = description.querySelector('input');
    expect(descriptionInput).toHaveValue('');

    const link = screen.getByTestId(`${dataTestid}-link`);
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Link');
    const linkInput = link.querySelector('input');
    expect(linkInput).toHaveValue('');

    await userEvent.type(descriptionInput as HTMLInputElement, 'Mock description');
    await userEvent.type(linkInput as HTMLInputElement, 'https://example.com/link_input');

    const okButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(okButton).toBeInTheDocument();
    await userEvent.click(okButton);

    expect(mockHandleSubmit).toHaveBeenCalledWith({
      address: 'https://example.com/link_input',
      label: 'Mock description',
    });

    expect(screen.queryByTestId(`${dataTestid}-error`)).not.toBeInTheDocument();
  });

  test('should render the modal link correctly with error', () => {
    renderWithProviders(<SourceLinkModal {...props} error={'Mock error'} />);

    const errorElement = screen.getByTestId(`${dataTestid}-error`);

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Mock error');
  });
});
