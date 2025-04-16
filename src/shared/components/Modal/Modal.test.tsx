import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Modal } from './Modal';

const mockOnClose = vi.fn();
const mockOnBackdropClick = vi.fn();
const mockOnSubmit = vi.fn();
const mockOnSecondBtnSubmit = vi.fn();
const mockOnThirdBtnSubmit = vi.fn();
const mockOnLeftBtnSubmit = vi.fn();

const commonProps = {
  'data-testid': 'modal-test-id',
  onClose: mockOnClose,
  onBackdropClick: mockOnBackdropClick,
  open: true,
  title: 'Modal Title',
  buttonText: 'Submit',
  children: <div>Modal Content</div>,
  onSubmit: mockOnSubmit,
  onSecondBtnSubmit: mockOnSecondBtnSubmit,
  onThirdBtnSubmit: mockOnThirdBtnSubmit,
  onLeftBtnSubmit: mockOnLeftBtnSubmit,
  secondBtnText: 'secondBtnText',
  thirdBtnText: 'thirdBtnText',
  leftBtnText: 'leftBtnText',
  hasSecondBtn: true,
  hasThirdBtn: true,
  hasLeftBtn: true,
};

describe('Modal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

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

    fireEvent.click(screen.getByTestId(`${commonProps['data-testid']}-close-button`));
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('clicking the overlay triggers onBackdropClick', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByTestId(`${commonProps['data-testid']}-backdrop`));
    await waitFor(() => {
      expect(mockOnBackdropClick).toHaveBeenCalled();
    });
  });

  test('clicking the submit button triggers onSubmit', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByTestId(`${commonProps['data-testid']}-submit-button`));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('clicking the second submit button triggers onSecondBtnSubmit', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByText(commonProps.secondBtnText));
    await waitFor(() => {
      expect(mockOnSecondBtnSubmit).toHaveBeenCalled();
    });
  });

  test('clicking the third submit button triggers onThirdBtnSubmit', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByText(commonProps.thirdBtnText));
    await waitFor(() => {
      expect(mockOnThirdBtnSubmit).toHaveBeenCalled();
    });
  });

  test('clicking the left submit button triggers onLeftBtnSubmit', async () => {
    render(<Modal {...commonProps} />);

    fireEvent.click(screen.getByText(commonProps.leftBtnText));
    await waitFor(() => {
      expect(mockOnLeftBtnSubmit).toHaveBeenCalled();
    });
  });
});
