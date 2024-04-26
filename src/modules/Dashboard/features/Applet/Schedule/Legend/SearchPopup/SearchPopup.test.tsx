import { waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { page } from 'resources';
import { initialStateData } from 'shared/state';
import { renderWithProviders } from 'shared/utils';
import { mockedCurrentWorkspace } from 'shared/mock';

import { SearchPopup } from './SearchPopup';
import { ScheduleOptions } from '../Legend.const';

const setSearchPopupVisible = jest.fn();
const setSchedule = jest.fn();
const onSelectUser = jest.fn();

const dataTestid = 'search-popup';
const appletId = '71d90215-e4ae-41c5-8c30-776e69f5378b';

const selectedRespondent1 = {
  icon: null,
  id: 'da838d8c-c931-4da0-9b26-35c315ec6a30',
  secretId: '884a6a78-a6d1-4f13-aaf2-6453ac036fc3',
  nickname: 'John Cooper',
  hasIndividualSchedule: true,
};

const selectedRespondent2 = {
  icon: null,
  id: 'e7fe4c32-5799-4b16-b862-f6427974a92b',
  secretId: 'e3150110-b43f-4437-9ae0-b8425a4d4d00',
  nickname: 'Sam Carter',
  hasIndividualSchedule: false,
};

const respondentsItems = [
  {
    icon: null,
    id: '62c234e3-ef32-43a7-9cc1-5b0c67a9f6ca',
    secretId: '41cd21cf-0821-46bc-b23e-0d49aac42534',
    nickname: 'Jane Doe',
    hasIndividualSchedule: false,
  },
  selectedRespondent1,
  selectedRespondent2,
];

const route = `/dashboard/${appletId}/schedule`;
const routePath = page.appletSchedule;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: initialStateData,
    workspacesRoles: initialStateData,
  },
};

const props = {
  open: true,
  setSearchPopupVisible,
  setSchedule,
  onSelectUser,
  selectedRespondent: null,
  respondentsItems,
  'data-testid': dataTestid,
};

describe('SearchPopup component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  test('renders the component correctly', async () => {
    renderWithProviders(<SearchPopup {...props} />, {
      route,
      routePath,
      preloadedState,
    });

    const popup = screen.getByTestId(dataTestid);
    expect(popup).toBeInTheDocument();

    const search = screen.getByTestId(`${dataTestid}-search`);
    expect(search).toBeInTheDocument();

    const regex = new RegExp(`${dataTestid}-respondent-\\d+$`);
    const respondents = screen.queryAllByTestId(regex);
    expect(respondents).toHaveLength(3);

    const closeButton = screen.getByRole('button');
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(setSchedule).toHaveBeenCalledWith(ScheduleOptions.DefaultSchedule);
      expect(setSearchPopupVisible).toHaveBeenCalledWith(false);
    });
  });

  test('tests the search input', async () => {
    renderWithProviders(<SearchPopup {...props} />, {
      route,
      routePath,
      preloadedState,
    });

    const search = screen.getByTestId(`${dataTestid}-search`);
    expect(search).toBeInTheDocument();

    const searchInput = search.querySelector('input') as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, 'john');
    await waitFor(() => {
      const regex = new RegExp(`${dataTestid}-respondent-\\d+$`);
      const respondents = screen.queryAllByTestId(regex);
      expect(respondents).toHaveLength(1);
    });
  });

  test('selects a respondent with hasIndividualSchedule = true', async () => {
    renderWithProviders(<SearchPopup {...props} />, {
      route,
      routePath,
      preloadedState,
    });

    const respondent = screen.getByText(/John Cooper/);
    await userEvent.click(respondent);

    expect(onSelectUser).toHaveBeenCalledWith(selectedRespondent1.id);
    expect(setSearchPopupVisible).toHaveBeenCalledWith(false);
  });

  test('selects respondent with hasIndividualSchedule = false', async () => {
    mockAxios.post.mockResolvedValueOnce({
      startTime: '00:00:00',
      endTime: '23:59:00',
      accessBeforeSchedule: false,
      oneTimeCompletion: false,
      timer: 0,
      timerType: 'NOT_SET',
      id: 'ddb29a51-0a46-4aaa-a21a-547aab584156',
      periodicity: {
        type: 'ALWAYS',
        startDate: null,
        endDate: null,
        selectedDate: null,
      },
      respondentId: 'respondentId',
      activityId: 'activityIdb',
      flowId: null,
      notification: null,
    });

    const { rerender } = renderWithProviders(<SearchPopup {...props} />, {
      route,
      routePath,
      preloadedState,
    });

    const inividualSchedulePopupDataTestid = `${dataTestid}-add-inividual-schedule-popup`;
    expect(await screen.queryByTestId(inividualSchedulePopupDataTestid)).not.toBeInTheDocument();

    const respondent = screen.getByText(/Sam Carter/);
    await userEvent.click(respondent);

    expect(onSelectUser).toHaveBeenCalledWith(selectedRespondent2.id);
    expect(setSearchPopupVisible).toHaveBeenCalledWith(false);

    expect(await screen.findByTestId(inividualSchedulePopupDataTestid)).toBeInTheDocument();

    const cancelButton = await screen.findByText('Cancel');
    await userEvent.click(cancelButton);

    expect(await screen.queryByTestId(inividualSchedulePopupDataTestid)).not.toBeInTheDocument();
    expect(setSearchPopupVisible).toHaveBeenCalledWith(true);
    expect(onSelectUser).toBeCalledWith(selectedRespondent2.id);

    await userEvent.click(respondent);

    const confirmButton = await screen.findByText('Confirm');
    await act(async () => {
      userEvent.click(confirmButton);
    });

    rerender(<SearchPopup {...props} selectedRespondent={selectedRespondent2} />);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/applets/${appletId}/events/individual/${selectedRespondent2.id}`,
        {},
        { signal: undefined },
      );
    });
  });
});
