// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RemoveOptionPopup } from './RemoveOptionPopup';

const conditions = [
  {
    key: '63cc28d6-bf2e-491b-b4f7-50727dc72111',
    itemKey: '40c9faec-61e9-478f-b07a-b7029b76abb5',
    match: 'any',
    conditions: [
      {
        key: '0f0e3586-c142-468c-b5cf-50c34eed5c77',
        type: 'EQUAL_TO_OPTION',
        payload: {
          optionValue: 'a321197e-2bc2-4468-be49-70b18fee1f19',
        },
        itemName: 'd7c55212-76a4-4ed4-9fdb-09042b7c6040',
      },
    ],
  },
];

const mockOption = {
  id: 'a321197e-2bc2-4468-be49-70b18fee1f19',
  text: 'Mocked Option 1',
  value: 0,
};

const mockWatch = vi.fn();
const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();
const dataTestid = 'remove-option-popup';

const props = {
  name: '',
  conditions,
  onClose: mockOnClose,
  onSubmit: mockOnSubmit,
  'data-testid': dataTestid,
};

vi.mock('modules/Builder/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useCustomFormContext: vi.fn(),
  };
});

describe('RemoveOptionPopup', () => {
  beforeEach(() => {
    useCustomFormContext.mockReturnValue({ watch: mockWatch });
    mockWatch.mockReturnValueOnce(mockOption);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('renders RemoveOptionPopup component', async () => {
    renderWithProviders(<RemoveOptionPopup {...props} />);

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();
    expect(within(title).getByText('Delete Option')).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();

    const content = screen.getByTestId(`${dataTestid}-content`);
    expect(content).toBeInTheDocument();

    expect(within(content).getByText(/Are you sure you want to delete Option/)).toBeInTheDocument();
    expect(within(content).getByText(/Mocked Option 1/)).toBeInTheDocument();
    expect(
      within(content).getByText(/It will also remove the Conditional\(s\) below/),
    ).toBeInTheDocument();

    const deleteButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(deleteButton).toHaveTextContent('Delete');
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(mockOnSubmit).toHaveBeenCalled();

    const cancelButton = screen.getByTestId(`${dataTestid}-secondary-button`);
    expect(cancelButton).toHaveTextContent('Cancel');
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
