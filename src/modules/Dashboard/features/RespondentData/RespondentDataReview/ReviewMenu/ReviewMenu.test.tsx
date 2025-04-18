import { PreloadedState } from '@reduxjs/toolkit';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { RootState } from 'redux/store';
import { page } from 'resources';
import { ParticipantTag, Roles } from 'shared/consts';
import { mockedAppletId, mockedCurrentWorkspace, mockedFullSubjectId1 } from 'shared/mock';
import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { RespondentsDataFormValues } from '../../RespondentData.types';
import { ReviewMenu } from './ReviewMenu';
import { ReviewMenuProps } from './ReviewMenu.types';

const mockedAnswerId = '0a7bcd14-24a3-48ed-8d6b-b059a6541ae4';
const route = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/responses?selectedDate=2023-12-05&answerId=${mockedAnswerId}`;
const routePath = page.appletParticipantDataReview;
const preloadedState: PreloadedState<RootState> = {
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
    workspacesRoles: initialStateData,
  },
  users: {
    respondentDetails: {
      ...initialStateData,
    },
    subjectDetails: {
      ...initialStateData,
      data: {
        result: {
          id: 'test-id',
          nickname: 'Mocked Respondent',
          secretUserId: '3921968c-3903-4872-8f30-a6e6a10cef36',
          lastSeen: null,
          tag: 'Child' as ParticipantTag,
          userId: null,
          firstName: 'John',
          lastName: 'Doe',
          roles: [],
          teamMemberCanViewData: true,
        },
      },
    },
  },
};

const dataTestid = 'respondents-review-menu';

const selectedDate = new Date('2023-12-15');
const onMonthChange = jest.fn();
const onSelectActivity = jest.fn();
const onSelectFlow = jest.fn();
const onSelectAnswer = jest.fn();
const onDateChange = jest.fn();

const ReviewMenuComponent = (compProps: Partial<ReviewMenuProps>) => {
  const { control } = useForm<RespondentsDataFormValues>({
    defaultValues: {
      responseDate: selectedDate,
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
        lastAnswerDate: '2023-09-26T12:11:46.162083',
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
        lastAnswerDate: '2023-09-26T10:10:05.162083',
        answerDates: [
          {
            createdAt: '2023-12-15T16:39:11.509095',
            answerId: 'fe2e188f-6b47-4507-b1e0-8f7707934b81',
          },
        ],
      },
    ],
    flows: [],
    selectedActivity: null,
    onSelectActivity,
    selectedFlow: null,
    onSelectFlow,
    onSelectAnswer,
    selectedAnswer: null,
    isDatePickerLoading: false,
    onDateChange,
    lastActivityCompleted: '2023-12-15T16:39:11.509095',
    isActivitiesFlowsLoading: false,
    ...compProps,
  };

  return <ReviewMenu {...props} />;
};
const expectReviewDateActivity = (enabled = true) => {
  const reviewDate = screen.getByTestId(`${dataTestid}-review-date`);
  expect(reviewDate).toBeInTheDocument();
  expect(reviewDate).toHaveTextContent('Response Date');
  const input = reviewDate.querySelector('input') as HTMLInputElement;
  expect(input).toBeInTheDocument();
  enabled
    ? expect(input).not.toHaveClass('Mui-disabled')
    : expect(input).toHaveClass('Mui-disabled');
};

describe('ReviewMenu', () => {
  test('renders component correctly, select activity, select timestamp', async () => {
    renderWithProviders(<ReviewMenuComponent />, { preloadedState, route, routePath });
    expect(screen.getByText('Responses')).toBeInTheDocument();
    expectReviewDateActivity(true);
    expect(
      screen.getByText('Subject: 3921968c-3903-4872-8f30-a6e6a10cef36, Mocked Respondent'),
    ).toBeInTheDocument();

    const activityLength = screen.queryAllByTestId(/respondents-review-menu-activity-\d+-select$/);
    expect(activityLength).toHaveLength(2);

    const activity0 = screen.getByTestId(`${dataTestid}-activity-0-select`);
    await userEvent.click(activity0);
    expect(onSelectActivity).toBeCalledTimes(1);

    const timestampLength = screen.queryAllByTestId(
      /respondents-review-menu-activity-0-completion-time-\d+$/,
    );
    expect(timestampLength).toHaveLength(2);

    expect(screen.getByText('11:21:40')).toBeInTheDocument();
    expect(screen.getByText('14:22:34')).toBeInTheDocument();

    const timestamp0 = screen.getByTestId(`${dataTestid}-activity-0-completion-time-1`);
    await userEvent.click(timestamp0);
    expect(onSelectAnswer).toHaveBeenCalledWith({
      answer: {
        answerId: 'd4147952-73e2-4693-b968-3ecf2468187d',
        createdAt: '2023-12-15T14:22:34.150182',
      },
    });
  });

  test('renders correctly when lastActivityCompleted is null', async () => {
    const props = {
      lastActivityCompleted: null,
    };
    renderWithProviders(<ReviewMenuComponent {...props} />, {
      preloadedState,
      route,
      routePath,
    });
    expectReviewDateActivity(false);
  });

  test('test change date of the month', async () => {
    renderWithProviders(<ReviewMenuComponent />, { preloadedState, route, routePath });

    const inputContainer = screen.getByTestId(`${dataTestid}-review-date`);
    expect(inputContainer).toBeInTheDocument();

    const input = inputContainer.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual('15 Dec 2023');

    await act(async () => {
      await userEvent.click(inputContainer);
    });

    const datepicker = (await screen.findByTestId(
      `${dataTestid}-review-date-popover`,
    )) as HTMLElement;
    expect(datepicker).toBeInTheDocument();

    const december11 = datepicker.getElementsByClassName(
      'react-datepicker__day react-datepicker__day--011',
    );
    expect(december11).toHaveLength(1);

    await userEvent.click(december11[0]);

    expect(input.value).toEqual('11 Dec 2023');
  });

  test('test change month', async () => {
    renderWithProviders(<ReviewMenuComponent />, { preloadedState, route, routePath });

    const inputContainer = screen.getByTestId(`${dataTestid}-review-date`);

    await act(async () => {
      await userEvent.click(inputContainer);
    });

    const datepicker = (await screen.findByTestId(
      `${dataTestid}-review-date-popover`,
    )) as HTMLElement;
    expect(datepicker).toBeInTheDocument();

    const datepickerHeader = datepicker.getElementsByClassName(
      'react-datepicker__header react-datepicker__header--custom',
    );
    expect(datepickerHeader[0]).toHaveTextContent('December');

    const svgNavigateLeft = datepickerHeader[0].querySelector('.svg-navigate-left');
    const svgNavigateRight = datepickerHeader[0].querySelector('.svg-navigate-right');

    if (svgNavigateLeft) {
      await userEvent.click(svgNavigateLeft);
      expect(datepickerHeader[0]).toHaveTextContent('November');
    }

    if (svgNavigateRight) {
      await userEvent.click(svgNavigateRight);
      expect(datepickerHeader[0]).toHaveTextContent('December');
    }
  });
});
