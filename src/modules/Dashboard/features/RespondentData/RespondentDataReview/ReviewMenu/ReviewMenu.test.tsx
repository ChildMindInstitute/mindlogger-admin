import { useForm } from 'react-hook-form';
import { fireEvent, screen } from '@testing-library/react';
import { page } from 'resources';
import { renderWithProviders } from 'shared/utils';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondent,
  mockedRespondent2,
  mockedRespondentId,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';

import { ReviewMenu } from './ReviewMenu';

const mockedAnswerId = '0a7bcd14-24a3-48ed-8d6b-b059a6541ae4';
const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/review?selectedDate=2023-12-05&answerId=${mockedAnswerId}`;
const routePath = page.appletRespondentDataReview;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  users: {
    allRespondents: {
      ...initialStateData,
      data: {
        result: [mockedRespondent, mockedRespondent2],
        count: 2,
      },
    },
    respondentDetails: {
      ...initialStateData,
      data: {
        result: {
          nickname: 'Mocked Respondent',
          secretUserId: '3921968c-3903-4872-8f30-a6e6a10cef36',
        },
      },
    },
  },
};

const dataTestid = 'respondents-review-menu';

const selectedDate = new Date('2023-12-15');
const onMonthChange = jest.fn();
const setSelectedActivity = jest.fn();
const onSelectAnswer = jest.fn();

const ReviewMenuComponent = () => {
  const { control } = useForm({
    defaultValues: {
      date: selectedDate,
    },
  });

  const props = {
    control,
    selectedDate,
    responseDates: [new Date('2023-12-11T11:21:40.509095'), new Date('2023-12-15T11:22:34.150182')],
    onMonthChange,
    activities: [
      {
        id: '951145fa-3053-4428-a970-70531e383d89',
        name: 'Activity 1',
        answerDates: [
          {
            createdAt: '2023-12-15T11:21:40.509095',
            answerId: 'ff9e1f86-3fa2-4edd-908c-832810555633',
          },
          {
            createdAt: '2023-12-15T14:22:34.150182',
            answerId: 'd4147952-73e2-4693-b968-3ecf2468187d',
          },
        ],
      },
      {
        id: 'ad9e1f86-3fa2-4edd-908c-832810555865',
        name: 'Activity 2',
        answerDates: [
          {
            createdAt: '2023-12-15T16:39:11.509095',
            answerId: 'fe2e188f-6b47-4507-b1e0-8f7707934b81',
          },
        ],
      },
    ],
    selectedActivity: null,
    selectedAnswer: null,
    setSelectedActivity,
    onSelectAnswer,
  };

  return <ReviewMenu {...props} />;
};

describe('ReviewMenu', () => {
  test('renders component correctly, select activity, select timestamp', () => {
    renderWithProviders(<ReviewMenuComponent />, { preloadedState, route, routePath });
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-review-date`)).toBeInTheDocument();
    expect(
      screen.getByText('User: 3921968c-3903-4872-8f30-a6e6a10cef36 (Mocked Respondent)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Select activity and response')).toBeInTheDocument();

    const activityLength = screen.queryAllByTestId(/respondents-review-menu-activity-\d+-select$/);
    expect(activityLength).toHaveLength(2);

    const activity0 = screen.getByTestId(`${dataTestid}-activity-0-select`);
    fireEvent.click(activity0);
    expect(setSelectedActivity).toBeCalledTimes(1);

    const timestampLength = screen.queryAllByTestId(
      /respondents-review-menu-activity-0-completion-time-\d+$/,
    );
    expect(timestampLength).toHaveLength(2);

    expect(screen.getByText('11:21:40')).toBeInTheDocument();
    expect(screen.getByText('14:22:34')).toBeInTheDocument();

    const timestamp0 = screen.getByTestId(`${dataTestid}-activity-0-completion-time-1`);
    fireEvent.click(timestamp0);
    expect(onSelectAnswer).toHaveBeenCalledWith({
      answerId: 'd4147952-73e2-4693-b968-3ecf2468187d',
      createdAt: '2023-12-15T14:22:34.150182',
    });
  });

  test('test change date of the month', () => {
    renderWithProviders(<ReviewMenuComponent />, { preloadedState, route, routePath });

    const inputContainer = screen.getByTestId('respondents-review-menu-review-date');
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual('15 Dec 2023');

    fireEvent.click(inputContainer);

    const datepicker = screen.getByTestId(
      'respondents-review-menu-review-date-popover',
    ) as HTMLElement;
    expect(datepicker).toBeInTheDocument();

    const december11 = datepicker.getElementsByClassName(
      'react-datepicker__day react-datepicker__day--011',
    );
    expect(december11).toHaveLength(1);

    fireEvent.click(december11[0]);
    expect(input.value).toEqual('11 Dec 2023');
  });

  test('test change month', () => {
    renderWithProviders(<ReviewMenuComponent />, { preloadedState, route, routePath });

    const inputContainer = screen.getByTestId('respondents-review-menu-review-date');

    fireEvent.click(inputContainer);

    const datepicker = screen.getByTestId(
      'respondents-review-menu-review-date-popover',
    ) as HTMLElement;
    expect(datepicker).toBeInTheDocument();

    const datepickerHeader = datepicker.getElementsByClassName(
      'react-datepicker__header react-datepicker__header--custom',
    );
    expect(datepickerHeader[0]).toHaveTextContent('December');

    const svgNavigateLeft = datepickerHeader[0].querySelector('.svg-navigate-left');
    const svgNavigateRight = datepickerHeader[0].querySelector('.svg-navigate-right');

    if (svgNavigateLeft) {
      fireEvent.click(svgNavigateLeft);
      expect(datepickerHeader[0]).toHaveTextContent('November');
    }

    if (svgNavigateRight) {
      fireEvent.click(svgNavigateRight);
      expect(datepickerHeader[0]).toHaveTextContent('December');
    }
  });
});
