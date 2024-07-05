import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { JEST_TEST_TIMEOUT } from 'shared/consts';

import { RespondentDataReviewContext } from '../RespondentDataReview.context';
import { ResponsesHeader } from './ResponsesHeader';
import { ResponsesHeaderProps } from './ResponsesHeader.types';

const dataTestId = 'review-header';
const mockOnButtonClick = jest.fn();
const defaultProps = {
  containerRef: { current: null },
  isAnswerSelected: false,
  name: 'Some Name',
  onButtonClick: mockOnButtonClick,
  'data-testid': dataTestId,
};

const renderReviewHeader = (props: ResponsesHeaderProps) =>
  renderWithProviders(<ResponsesHeader {...props} />);

describe('ResponsesHeader', () => {
  test('renders without crashing', () => {
    const { container } = renderReviewHeader(defaultProps);

    expect(container).toBeTruthy();
  });

  test(
    'renders correctly when answer is selected',
    async () => {
      const { getByText, getByTestId } = renderReviewHeader({
        ...defaultProps,
        isAnswerSelected: true,
      });

      const stickyHeader = getByTestId(`${dataTestId}-sticky-header`);
      expect(stickyHeader).toBeInTheDocument();
      expect(getComputedStyle(stickyHeader).justifyContent).toBe('space-between');
      expect(getByText('Some Name')).toBeInTheDocument();
      expect(getByText('Feedback')).toBeInTheDocument();

      const feedbackButton = getByTestId(`${dataTestId}-feedback-button`);
      expect(feedbackButton).toBeEnabled();

      await userEvent.click(feedbackButton);
      expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
    },
    JEST_TEST_TIMEOUT,
  );

  test('renders correctly when answer is not selected', () => {
    const { getByTestId, queryByText } = renderReviewHeader(defaultProps);

    const stickyHeader = getByTestId(`${dataTestId}-sticky-header`);
    expect(stickyHeader).toBeInTheDocument();
    expect(getComputedStyle(stickyHeader).justifyContent).toBe('flex-end');
    expect(queryByText('Activity Name')).not.toBeInTheDocument();
    expect(getByTestId(`${dataTestId}-feedback-button`)).toBeDisabled();
  });

  test('does not render the Feedback button if the Feedback Panel is open', async () => {
    const { queryByTestId, queryByText } = renderWithProviders(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <RespondentDataReviewContext.Provider value={{ isFeedbackOpen: true }}>
        <ResponsesHeader {...defaultProps} isAnswerSelected />,
      </RespondentDataReviewContext.Provider>,
    );

    expect(queryByText('Feedback')).not.toBeInTheDocument();
    expect(queryByTestId(`${dataTestId}-feedback-button`)).not.toBeInTheDocument();
  });
});
