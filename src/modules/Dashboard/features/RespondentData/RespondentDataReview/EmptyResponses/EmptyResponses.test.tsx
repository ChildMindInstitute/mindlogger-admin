import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { EmptyResponses } from './EmptyResponses';
import { EmptyResponsesProps } from './EmptyResponses.types';

const dataTestid = 'empty-responses';
const selectResponsesText =
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
    },
    {
      props: { isActivityOrFlowSelected: false },
      description: 'renders correct empty state when no activity or flow selected',
    },
    {
      props: { isActivityOrFlowSelected: false, isAnswerSelected: false },
      description: 'renders correct empty state when no answer, and no activity or flow selected',
    },
    {
      props: { hasAnswers: false },
      description: 'renders correct empty state when no answer provided',
    },
    { props: { error: 'some error' }, description: 'renders error if provided' },
  ].forEach(({ props, description }) => {
    test(description, () => {
      renderComponent(props);

      expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
      if (props.error) {
        expect(screen.getByText(props.error)).toBeInTheDocument();
      } else if (props.hasAnswers === false) {
        expect(screen.getByText(noAvailableData)).toBeInTheDocument();
      } else {
        expect(screen.getByText(selectResponsesText)).toBeInTheDocument();
      }
    });
  });
});
