import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreloadedState } from '@reduxjs/toolkit';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletId, mockedRespondentId } from 'shared/mock';
import { page } from 'resources';
import { ReportContext } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Report.context';
import { RootState } from 'redux/store';
import { initialStateData } from 'shared/state';

import { ChartTooltip } from './ChartTooltip';
import { ChartTooltipProps, ScatterTooltipRowData } from './ChartTooltip.types';

const route = `/dashboard/${mockedAppletId}/participants/${mockedRespondentId}/dataviz/summary`;
const routePath = page.appletParticipantDataSummary;

const dataTestid = 'scatter-chart';
const answerId = 'some-answer-id';
const flowSubmitId = 'some-submit-id';
const date = 1703089235000; // Dec 20 2023, 16:20:35

const getProps = (props?: Partial<ScatterTooltipRowData>) => ({
  data: {
    raw: {
      x: 1,
      y: 0,
      id: answerId,
      areSubscalesVisible: false,
      isFlow: false,
      reviewCount: { mine: 1, other: 2 },
      ...props,
    },
    parsed: {
      x: date,
    },
  },
  onMouseEnter: jest.fn(),
  onMouseLeave: jest.fn(),
  'data-testid': dataTestid,
});

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const setCurrentActivityCompletionData = jest.fn();

const getPreloadedState = (hasAssessment = false) => ({
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet, appletMeta: { hasAssessment } },
    },
  },
});

const renderComponent = (
  props?: Partial<ChartTooltipProps>,
  preloadedState?: PreloadedState<RootState>,
) =>
  renderWithProviders(
    <ReportContext.Provider
      value={{ setCurrentActivityCompletionData, currentActivityCompletionData: null }}
    >
      <ChartTooltip data={null} {...props} />
    </ReportContext.Provider>,
    {
      route,
      routePath,
      preloadedState,
    },
  );

const viewResponseButtonClick = async () => {
  const viewResponseButton = screen.getByTestId(`${dataTestid}-tooltip-view-response`);
  expect(within(viewResponseButton).getByText('View response')).toBeInTheDocument();
  expect(viewResponseButton).toBeInTheDocument();

  await userEvent.click(viewResponseButton);
};

const testPositiveFlowWithNavigate = async (text: string, search: string) => {
  const tooltip = screen.getByTestId(`${dataTestid}-tooltip`);
  expect(tooltip).toBeInTheDocument();
  expect(within(tooltip).getByText('View response')).toBeInTheDocument();

  const reviewButton = screen.getByTestId(`${dataTestid}-tooltip-review-count`);
  expect(reviewButton).toBeInTheDocument();
  expect(within(reviewButton).getByText(text)).toBeInTheDocument();

  await userEvent.click(reviewButton);

  expect(mockedNavigate).toBeCalledWith({
    pathname: `/dashboard/${mockedAppletId}/participants/${mockedRespondentId}/dataviz/responses`,
    search,
  });
};

describe('ChartTooltip', () => {
  test('renders component correctly when props data is null', () => {
    renderComponent();

    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('renders component correctly when entity is Activity answer', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps());

    await viewResponseButtonClick();

    expect(mockedNavigate).toBeCalledWith({
      pathname: `/dashboard/${mockedAppletId}/participants/${mockedRespondentId}/dataviz/responses`,
      search: `selectedDate=2023-12-20&answerId=${answerId}&isFeedbackVisible=false`,
    });
  });

  test('renders component and navigates correctly when entity is Activity Flow submission', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps({ id: flowSubmitId, isFlow: true }));

    await viewResponseButtonClick();

    expect(mockedNavigate).toBeCalledWith({
      pathname: `/dashboard/${mockedAppletId}/participants/${mockedRespondentId}/dataviz/responses`,
      search: `selectedDate=2023-12-20&submitId=${flowSubmitId}&isFeedbackVisible=false`,
    });
  });

  test('renders component correctly when areSubscalesVisible is true', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps({ areSubscalesVisible: true }));

    const tooltip = screen.getByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByText('Dec 20, 16:20')).toBeInTheDocument();

    const showSubscaleResultButton = screen.getByTestId(
      `${dataTestid}-tooltip-show-subscale-result-button`,
    );
    expect(showSubscaleResultButton).toBeInTheDocument();

    await userEvent.click(showSubscaleResultButton);
    expect(setCurrentActivityCompletionData).toHaveBeenCalledWith({
      answerId,
      date,
    });
  });

  test('renders component correctly when areSubscalesVisible is false', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps({ areSubscalesVisible: false }));

    const showSubscaleResultButton = screen.queryByTestId(
      `${dataTestid}-tooltip-show-subscale-result-button`,
    );
    expect(showSubscaleResultButton).not.toBeInTheDocument();
  });

  test('renders component and navigates correctly to Assessment Reviews with hasAssessment="true" and no reviews', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps({ reviewCount: { mine: 0, other: 0 } }), getPreloadedState(true));

    await testPositiveFlowWithNavigate(
      'Leave a review',
      `selectedDate=2023-12-20&answerId=${answerId}&isFeedbackVisible=true`,
    );
  });

  test('renders component and navigates correctly to Assessment Reviews with hasAssessment="true" and no reviews for Flow', async () => {
    renderComponent(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getProps({
        isFlow: true,
        id: flowSubmitId,
        reviewCount: { mine: 0, other: 0 },
      }),
      getPreloadedState(true),
    );

    await testPositiveFlowWithNavigate(
      'Leave a review',
      `selectedDate=2023-12-20&submitId=${flowSubmitId}&isFeedbackVisible=true`,
    );
  });

  test('renders component and navigates correctly to Assessment Reviews with hasAssessment="true" and provided review count', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps(), getPreloadedState(true));

    await testPositiveFlowWithNavigate(
      'See 3 reviews (mine & 2 others)',
      `selectedDate=2023-12-20&answerId=${answerId}&isFeedbackVisible=true`,
    );
  });

  test('renders component and navigates correctly to Assessment Reviews with hasAssessment="true" and provided review count for Flow', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    renderComponent(getProps({ isFlow: true, id: flowSubmitId }), getPreloadedState(true));

    await testPositiveFlowWithNavigate(
      'See 3 reviews (mine & 2 others)',
      `selectedDate=2023-12-20&submitId=${flowSubmitId}&isFeedbackVisible=true`,
    );
  });
});
