// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';
import { page } from 'resources';
import { ReportContext } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.context';

import { ChartTooltip } from './ChartTooltip';

const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;

const dataTestid = 'scatter-chart';
const answerId = '773d904e-15a0-4702-b53b-d3f3e2d8be71';
const date = 1703089235000; // Dec 20 2023, 16:20:35

const getProps = (areSubscalesVisible = false) => ({
  data: {
    raw: {
      x: 1,
      y: 0,
      answerId,
      areSubscalesVisible,
    },
    parsed: {
      x: date,
    },
  },
  onMouseEnter: jest.fn(),
  onMouseLeave: jest.fn(),
  'data-testid': dataTestid,
});

const mockedReviewAnswerNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedReviewAnswerNavigate,
}));

const setCurrentActivityCompletionData = jest.fn();

describe('ChartTooltip', () => {
  test('renders component correctly when props data is null', () => {
    renderWithProviders(
      <ReportContext.Provider value={{ setCurrentActivityCompletionData }}>
        <ChartTooltip data={null} />
      </ReportContext.Provider>,
      {
        route,
        routePath,
      },
    );

    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('renders component correctly when areSubscalesVisible is true', () => {
    renderWithProviders(
      <ReportContext.Provider value={{ setCurrentActivityCompletionData }}>
        <ChartTooltip {...getProps(true)} />
      </ReportContext.Provider>,
      {
        route,
        routePath,
      },
    );

    const tooltip = screen.getByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Dec 20, 16:20')).toBeInTheDocument();

    const reviewButton = screen.getByTestId(`${dataTestid}-tooltip-review-button`);
    expect(reviewButton).toBeInTheDocument();

    fireEvent.click(reviewButton);
    expect(mockedReviewAnswerNavigate).toBeCalledWith({
      pathname: `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/review`,
      search: `selectedDate=2023-12-20&answerId=${answerId}`,
    });

    const showSubscaleResultButton = screen.getByTestId(
      `${dataTestid}-tooltip-show-subscale-result-button`,
    );
    expect(showSubscaleResultButton).toBeInTheDocument();

    fireEvent.click(showSubscaleResultButton);
    expect(setCurrentActivityCompletionData).toHaveBeenCalledWith({
      answerId,
      date,
    });
  });

  test('renders component correctly when areSubscalesVisible is false', () => {
    renderWithProviders(
      <ReportContext.Provider value={{ setCurrentActivityCompletionData }}>
        <ChartTooltip {...getProps()} />
      </ReportContext.Provider>,
      {
        route,
        routePath,
      },
    );

    const showSubscaleResultButton = screen.queryByTestId(
      `${dataTestid}-tooltip-show-subscale-result-button`,
    );
    expect(showSubscaleResultButton).not.toBeInTheDocument();
  });
});
