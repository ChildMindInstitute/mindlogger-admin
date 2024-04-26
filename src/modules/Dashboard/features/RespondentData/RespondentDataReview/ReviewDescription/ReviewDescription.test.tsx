import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ReviewDescription } from './ReviewDescription';
import { ReviewDescriptionProps } from './ReviewDescription.types';
import { EMPTY_IDENTIFIER } from './ReviewDescription.const';

const dataTestId = 'review';
const mockedIdentifier = 'ident-1';
const mockedVersion = 'version-111.0.25';
const renderComponent = (props?: Partial<ReviewDescriptionProps>) =>
  renderWithProviders(
    <ReviewDescription
      endDateTime="2024-03-14T14:33:48.750000"
      createdAt="2024-03-14T14:20:00.100000"
      identifier={mockedIdentifier}
      version={mockedVersion}
      data-testid={dataTestId}
      {...props}
    />,
  );

describe('Review Description', () => {
  test('renders without crashing', () => {
    renderComponent();

    expect(screen.getByTestId('review-description')).toBeInTheDocument();
    expect(screen.getByText('Viewing responses submitted on:')).toBeInTheDocument();
    expect(screen.getByText('Mar 14, 2024 14:33:48')).toBeInTheDocument();
    expect(screen.getByText('Response Identifier:')).toBeInTheDocument();
    expect(screen.getByText(mockedIdentifier)).toBeInTheDocument();
    expect(screen.queryByText(EMPTY_IDENTIFIER)).not.toBeInTheDocument();
    expect(screen.getByText('Version:')).toBeInTheDocument();
    expect(screen.getByText(mockedVersion)).toBeInTheDocument();
  });

  test('shows createdAt date and time if endDateTime is null', () => {
    renderComponent({ endDateTime: null });

    expect(screen.getByText('Mar 14, 2024 14:20:00')).toBeInTheDocument();
  });

  test('renders correctly when identifier is not provided', async () => {
    renderComponent({ identifier: null });

    expect(screen.getByText(EMPTY_IDENTIFIER)).toBeInTheDocument();
  });
});
