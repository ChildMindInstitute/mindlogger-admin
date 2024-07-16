import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { EmptyResponses } from './EmptyResponses';
import { EmptyResponsesProps } from './EmptyResponses.types';

const dataTestid = 'empty-responses';
const emptyText1 = 'Select the date and response time to review the response data.';
const emptyText2 =
  'Select the date, Activity Flow or Activity, and response time to review the response data.';
const noAvailableData = 'No available Data yet';

const renderComponent = (props?: Partial<EmptyResponsesProps>) =>
  renderWithProviders(
    <EmptyResponses
      hasAnswers
      isActivityOrFlowSelected
      isAnswerSelected
      error={null}
      data-testid={dataTestid}
      {...props}
    />,
  );

describe('EmptyResponses', () => {
  test('returns null when answer, activity or flow selected, has answers, and no error provided', () => {
    const { container } = renderComponent();

    expect(screen.queryByTestId(dataTestid)).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  [
    {
      props: { isAnswerSelected: false },
      description: 'renders correct empty state when no answer selected',
      result: emptyText1,
    },
    {
      props: { isActivityOrFlowSelected: false },
      description: 'renders correct empty state when no activity or flow selected',
      result: emptyText2,
    },
    {
      props: { isActivityOrFlowSelected: false, isAnswerSelected: false },
      description: 'renders correct empty state when no answer, and no activity or flow selected',
      result: emptyText2,
    },
    {
      props: { hasAnswers: false },
      description: 'renders correct empty state when no answer provided',
      result: noAvailableData,
    },
    {
      props: { error: 'some error' },
      description: 'renders error if provided',
      result: 'some error',
    },
  ].forEach(({ props, description, result }) => {
    test(description, () => {
      renderComponent(props);

      expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
      expect(screen.getByText(result)).toBeInTheDocument();
    });
  });
});
