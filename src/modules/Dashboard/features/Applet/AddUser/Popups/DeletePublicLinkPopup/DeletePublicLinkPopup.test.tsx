import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { DeletePublicLinkPopup } from './DeletePublicLinkPopup';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn();

describe('DeletePublicLinkPopup', () => {
  test('should render popup correctly', () => {
    renderWithProviders(<DeletePublicLinkPopup open={true} onClose={onCloseMock} onSubmit={onSubmitMock} />);
    expect(screen.getByTestId('dashboard-add-users-generate-link-delete-popup')).toBeInTheDocument();
    expect(screen.getByText('Delete Public Link')).toBeInTheDocument();
    expect(
      screen.getByText(
        'If deleted, the public link will become invalid, and the respondents will not be able to use it anymore. Are you sure you want to delete it?',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toBeCalled();

    fireEvent.click(screen.getByText('Delete'));
    expect(onSubmitMock).toBeCalled();
  });
});
