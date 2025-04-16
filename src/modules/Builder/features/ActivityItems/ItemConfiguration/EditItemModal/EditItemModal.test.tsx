// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedActivityId, mockedAppletFormData, mockedAppletId } from 'shared/mock';
import { page } from 'resources';

import { EditItemModal } from './EditItemModal';

const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();

const dataTestid = 'builder-activity-items-edit-item-popup';
const routePath = page.builderAppletActivityItem;

describe('EditItemModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal with correct title, buttons and conditional logic', async () => {
    renderWithAppletFormData({
      children: (
        <EditItemModal
          open
          itemFieldName={'activities.0.items.0'}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      ),
      appletFormData: {
        ...mockedAppletFormData,
      },
      options: {
        route: `/builder/${mockedAppletId}/activities/${mockedActivityId}/items/c17b7b59-8074-4c69-b787-88ea9ea3df5d`,
        routePath,
      },
    });

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Edit Item');

    const closeButton = screen.getByTestId(`${dataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();

    expect(screen.getByText(/Are you sure you want to edit Item/)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-item-name`)).toHaveTextContent('Item1'); // item name

    const cancelButton = screen.getByTestId(`${dataTestid}-secondary-button`);
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveTextContent('Cancel');
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();

    const continueButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toHaveTextContent('Continue');
    await userEvent.click(continueButton);
    expect(mockOnSubmit).toHaveBeenCalled();

    expect(screen.getByText(/It will also remove the Conditional\(s\) below:/)).toBeInTheDocument();

    const conditionalPanelButton = screen.getByTestId('builder-conditional-panel-btn');
    expect(conditionalPanelButton).toBeInTheDocument();
  });

  test('renders modal without conditional logic', async () => {
    const mockedActivities = mockedAppletFormData.activities.map((activity) => ({
      ...activity,
      conditionalLogic: null,
    }));

    renderWithAppletFormData({
      children: (
        <EditItemModal
          open
          itemFieldName={'activities.0.items.2'}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      ),
      appletFormData: {
        ...mockedAppletFormData,
        activities: mockedActivities,
      },
      options: {
        route: `/builder/${mockedAppletId}/activities/${mockedActivityId}/items/97c34ed6-4d18-4cb6-a0c8-b1cb2efaa24c`,
        routePath,
      },
    });

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();

    expect(screen.getByText(/Are you sure you want to edit Item/)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-item-name`)).toHaveTextContent('Item3'); // item name

    expect(
      screen.queryByText(/It will also remove the Conditional\(s\) below:/),
    ).not.toBeInTheDocument();

    const conditionalPanelButton = screen.queryByTestId('builder-conditional-panel-btn');
    expect(conditionalPanelButton).not.toBeInTheDocument();
  });
});
