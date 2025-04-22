import { fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedManager,
  mockedFullParticipant1,
  mockedFullParticipant2,
  mockedFullSubjectId1,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { ApiResponseCodes } from 'api';

import { SelectRespondentsPopup } from './SelectRespondentsPopup';
import { SearchAcross } from './SelectRespondents/SelectRespondents.const';

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
    respondentDetails: {
      ...initialStateData,
    },
    subjectDetails: {
      ...initialStateData,
    },
  },
};

const mockedCloseFn = vi.fn();
const getPopup = (withSelectedRespondents = true) => (
  <SelectRespondentsPopup
    appletName="testName"
    appletId={mockedAppletId}
    user={mockedManager}
    selectedRespondents={withSelectedRespondents ? [mockedFullSubjectId1] : []}
    selectRespondentsPopupVisible={true}
    onClose={mockedCloseFn}
  />
);

const successfulResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [mockedFullParticipant1, mockedFullParticipant2],
    count: 2,
  },
};

describe('SelectRespondentsPopup component tests', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulResponse);
  });

  test('should appear popup without selected respondents', async () => {
    renderWithProviders(getPopup(false), { preloadedState });
    const tableRows = await screen.findAllByTestId(/table-row-\d+/);
    const select = screen.getByTestId('select-respondents-popup-search-across');
    const selectInput = await waitFor(() => select.querySelector('input'));

    await waitFor(() => {
      expect(selectInput?.value).toBe(SearchAcross.All);
      expect(tableRows.length).toBe(2);
      expect(screen.getByTestId('dashboard-managers-select-respondents-popup')).toBeInTheDocument();
      expect(screen.getByText('Mocked Respondent')).toBeInTheDocument();
      expect(screen.getByText('Test Respondent')).toBeInTheDocument();
      expect(
        screen.getByText('To proceed, at least 1 Respondent should be selected.'),
      ).toBeInTheDocument();
    });
  });

  test('should appear popup with selected respondents', async () => {
    renderWithProviders(getPopup(), { preloadedState });

    await waitFor(() => {
      expect(screen.getByText('1 Respondent selected')).toBeInTheDocument();
    });
  });

  test('should confirm popup with selected respondents', async () => {
    renderWithProviders(getPopup(), { preloadedState });

    await screen.findAllByTestId(/table-row-\d+/);

    fireEvent.click(screen.getByText('Confirm'));

    expect(mockedCloseFn).toBeCalledWith([mockedFullSubjectId1]);
  });

  describe('should search respondents', () => {
    test('across all', async () => {
      renderWithProviders(getPopup(), { preloadedState });
      const mockedSearchValue = 'mockedSearchValue';

      const search = await waitFor(() => screen.getByTestId('dashboard-select-respondents-search'));
      const searchInput = search.querySelector('input');
      searchInput && fireEvent.change(searchInput, { target: { value: mockedSearchValue } });

      await waitFor(() => {
        expect(screen.getByText(/No match was found/)).toBeInTheDocument();
      });

      searchInput && fireEvent.change(searchInput, { target: { value: 'Mocked' } });
      await waitFor(() => {
        expect(screen.queryAllByTestId(/table-row-\d+/).length).toBe(1);
        expect(screen.getByText('Mocked Respondent')).toBeInTheDocument();
      });
    });

    test('across selected', async () => {
      renderWithProviders(getPopup(), { preloadedState });

      const select = screen.getByTestId('select-respondents-popup-search-across');
      const selectInput = await waitFor(() => select.querySelector('input'));
      selectInput && fireEvent.change(selectInput, { target: { value: SearchAcross.Selected } });

      await waitFor(() => {
        expect(screen.queryAllByTestId(/table-row-\d+/).length).toBe(1);
        expect(screen.getByText('Mocked Respondent')).toBeInTheDocument();
        expect(screen.queryByText('Test Respondent')).not.toBeInTheDocument();
      });
    });

    test('across unselected', async () => {
      renderWithProviders(getPopup(), { preloadedState });

      const select = screen.getByTestId('select-respondents-popup-search-across');
      const selectInput = await waitFor(() => select.querySelector('input'));
      selectInput && fireEvent.change(selectInput, { target: { value: SearchAcross.Unselected } });

      await waitFor(() => {
        expect(screen.queryAllByTestId(/table-row-\d+/).length).toBe(1);
        expect(screen.queryByText('Mocked Respondent')).not.toBeInTheDocument();
        expect(screen.getByText('Test Respondent')).toBeInTheDocument();
      });
    });
  });
});
