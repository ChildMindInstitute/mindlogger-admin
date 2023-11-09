import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Modal } from './Modal';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnSecondBtnSubmit = jest.fn();
const mockOnThirdBtnSubmit = jest.fn();

const commonProps = {
  onClose: mockOnClose,
  open: true,
  title: 'Modal Title',
  buttonText: 'Submit',
  children: <div>Modal Content</div>,
  onSubmit: mockOnSubmit,
  onSecondBtnSubmit: mockOnSecondBtnSubmit,
  onThirdBtnSubmit: mockOnThirdBtnSubmit,
  secondBtnText: 'secondBtnText',
  thirdBtnText: 'thirdBtnText',
  hasSecondBtn: true,
  hasThirdBtn: true,
};

describe('Modal Component', () => {
  test('should render the modal with all elements', () => {
    render(<Modal {...commonProps} />);

    expect(screen.getByText(commonProps.title)).toBeInTheDocument();
    expect(screen.getByText(commonProps.buttonText)).toBeInTheDocument();
    expect(screen.getByText(commonProps.secondBtnText)).toBeInTheDocument();
    expect(screen.getByText(commonProps.thirdBtnText)).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('clicking the close button triggers onClose', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByTestId('modal-close-btn'));
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('clicking the submit button triggers onSubmit', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByTestId('modal-submit-btn'));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('clicking the submit button2 triggers onSubmit2', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByText(commonProps.secondBtnText));
    await waitFor(() => {
      expect(mockOnSecondBtnSubmit).toHaveBeenCalled();
    });
  });

  test('clicking the submit button3 triggers onSubmit3', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByText(commonProps.thirdBtnText));
    await waitFor(() => {
      expect(mockOnThirdBtnSubmit).toHaveBeenCalled();
    });
  });
});
