import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRouterDom from 'react-router-dom';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';
import { page } from 'resources';
import { variables } from 'shared/styles';

import { ReviewMenuItem } from './ReviewMenuItem';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';

const preselectedAnswerId = 'answer-id-3';
const routeWithAnswerId = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses?answerId=${preselectedAnswerId}`;
const routeWithoutAnswerId = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/responses`;
const routePath = page.appletRespondentDataReview;
const preselectedAnswer = {
  createdAt: '2023-12-15T22:20:30.150182',
  endDatetime: '2023-12-15T22:20:30.150182',
  answerId: preselectedAnswerId,
};
const latestAnswer = {
  createdAt: '2023-12-15T23:20:36.150182',
  endDatetime: '2023-12-15T23:29:36.150182',
  answerId: 'answer-id-2',
};
const firstAnswer = {
  createdAt: '2023-12-15T21:20:30.150182',
  answerId: 'answer-id-1',
};
const mockedActivity = {
  id: '1',
  name: 'Activity 123',
  lastAnswerDate: '2023-12-15T23:29:36.150182',
  answerDates: [firstAnswer, latestAnswer, preselectedAnswer],
};
const mockedOnSelectItem = jest.fn();
const mockedOnSelectAnswer = jest.fn();
const dataTestid = 'review-menu-item';

const renderComponent = (route: string, props?: Partial<ReviewMenuItemProps>) =>
  renderWithProviders(
    <ReviewMenuItem
      item={mockedActivity}
      isSelected={false}
      selectedAnswer={null}
      onSelectItem={mockedOnSelectItem}
      onSelectAnswer={mockedOnSelectAnswer}
      data-testid={dataTestid}
      {...props}
    />,
    {
      preloadedState: {},
      route,
      routePath,
    },
  );

describe('Review Menu Item component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders and functions correctly when an answer ID is not present in the route', async () => {
    const setSearchParamsMock = jest.fn();
    jest
      .spyOn(reactRouterDom, 'useSearchParams')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockReturnValue([{ get: jest.fn() }, setSearchParamsMock]);

    renderComponent(routeWithoutAnswerId);

    const activityHeader = screen.getByTestId(`${dataTestid}-select`);

    expect(screen.getByText('Activity 123')).toBeInTheDocument();
    expect(activityHeader.querySelector('.svg-navigate-down')).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestid}-completion-wrapper`)).not.toBeInTheDocument();

    await userEvent.click(activityHeader);

    expect(mockedOnSelectItem).toHaveBeenCalledWith(mockedActivity);
    expect(mockedOnSelectAnswer).toHaveBeenNthCalledWith(1, { answer: null });
    expect(activityHeader.querySelector('.svg-navigate-up')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-completion-wrapper`)).toBeInTheDocument();
    expect(setSearchParamsMock).toHaveBeenCalledWith(undefined);

    const timestamps = screen.queryAllByTestId(/review-menu-item-completion-time-\d+$/);

    expect(timestamps).toHaveLength(3);

    const timestamp3 = screen.getByTestId(`${dataTestid}-completion-time-2`);

    expect(timestamp3).toBeInTheDocument();
    expect(timestamp3).toHaveTextContent('23:29:36');

    await userEvent.click(timestamp3);

    expect(mockedOnSelectAnswer).toHaveBeenNthCalledWith(2, {
      answer: latestAnswer,
    });
  });

  test('renders and functions correctly when an answer ID is present in the route and no answer is selected', async () => {
    renderComponent(routeWithAnswerId);

    expect(mockedOnSelectAnswer).toHaveBeenCalledWith({
      answer: preselectedAnswer,
      isRouteCreated: true,
    });
    expect(mockedOnSelectItem).toHaveBeenCalledWith(mockedActivity);

    await waitFor(() => {
      const activityHeader = screen.getByTestId(`${dataTestid}-select`);
      expect(activityHeader.querySelector('.svg-navigate-up')).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestid}-completion-wrapper`)).toBeInTheDocument();
    });
  });

  test('renders with already selected activity', async () => {
    renderComponent(routeWithoutAnswerId, { isSelected: true });

    expect(screen.getByTestId(`${dataTestid}-item`)).toHaveStyle({
      backgroundColor: variables.palette.surface2,
    });
    expect(screen.queryByTestId(`${dataTestid}-completion-wrapper`)).not.toBeInTheDocument();
  });
});
