import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import userEvent from '@testing-library/user-event';

import { waitForTheUpdate } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedRespondent,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import { ApiResponseCodes } from 'api';

import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackForm } from '../Feedback.types';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { RespondentDataReviewContextType } from '../../RespondentDataReview.types';

const noteTestId = 'respondents-summary-feedback-notes-note';
const newNoteValue = 'New note has been added';
const mockedAnswerId = '0a7bcd14-24a3-48ed-8d6b-b059a6541ae4';
const route = `/dashboard/${mockedAppletId}/participants/${mockedRespondent}/dataviz/responses?selectedDate=2023-11-27&answerId=${mockedAnswerId}`;
const routePath = page.appletParticipantDataReview;
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
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
};

const mockedActivity = {
  id: '268af284-5b46-45c9-927f-cb641e973093',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
  lastAnswerDate: '2023-09-26T12:11:46.162083',
};

const mockedGetWithNotes = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [
      {
        id: '950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e',
        user: {
          firstName: 'John',
          lastName: 'Doe',
        },
        note: 'New note',
        createdAt: '2023-11-29T12:14:58.395686',
      },
      {
        id: '4eb2f59a-e0ba-464c-b3c7-fb4c3a2e3ac0',
        user: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
        note: 'Note 1',
        createdAt: '2023-11-28T09:01:44.861355',
      },
    ],
    count: 2,
  },
};

const FormComponent = ({ children }: { children: ReactNode }) => {
  const methods = useForm<FeedbackForm>({
    defaultValues: {
      newNote: '',
      assessmentItems: [],
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderFeedbackNotes = () =>
  renderWithProviders(
    <RespondentDataReviewContext.Provider
      value={{ isFeedbackOpen: true } as RespondentDataReviewContextType}
    >
      <FormComponent>{<FeedbackNotes activity={mockedActivity} />}</FormComponent>
    </RespondentDataReviewContext.Provider>,
    {
      preloadedState,
      route,
      routePath,
    },
  );

const mockGetWithNotes = () => {
  mockAxios.get.mockResolvedValueOnce(mockedGetWithNotes);
};

describe('FeedbackNotes', () => {
  test('should render array of notes', async () => {
    mockGetWithNotes();
    renderFeedbackNotes();

    await waitFor(() => {
      const elementsWithTestIdSubstring = screen.queryAllByTestId(
        /respondents-summary-feedback-notes-note-\d+$/,
      );
      expect(elementsWithTestIdSubstring).toHaveLength(2);
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/New note/)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Note 1/)).toBeInTheDocument();
    });
  });

  test('should save new note', async () => {
    mockGetWithNotes();
    renderFeedbackNotes();

    // wait for the isLoading process of getAnswersNotes to become false
    await waitForTheUpdate();

    await userEvent.type(screen.getByLabelText(/Add a New Note/i), newNoteValue);
    await userEvent.click(screen.getByTestId('respondents-summary-feedback-notes-save'));
    mockAxios.post.mockResolvedValueOnce(null);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/activities/${mockedActivity.id}/notes`,
        {
          note: newNoteValue,
        },
        { signal: undefined },
      );
    });
  });

  test('should edit an existing note', async () => {
    mockGetWithNotes();
    renderFeedbackNotes();

    await waitFor(() => {
      const hiddenEditAction = screen.queryByTestId(`${noteTestId}-0-edit`);

      expect(hiddenEditAction).toBeNull();

      const noteHeader = screen.queryByTestId(`${noteTestId}-0-header`) as HTMLElement;
      fireEvent.mouseEnter(noteHeader);
      const visibleEditAction = screen.queryByTestId(`${noteTestId}-0-edit`) as HTMLElement;

      expect(visibleEditAction).toBeInTheDocument();

      fireEvent.click(visibleEditAction);
    });

    await waitFor(() => {
      const noteContainer = screen.queryByTestId(`${noteTestId}-0-text`) as HTMLElement;
      const textarea = noteContainer.querySelector('textarea') as HTMLElement;
      fireEvent.change(textarea, {
        target: { value: newNoteValue },
      });
      fireEvent.click(screen.getByTestId(`${noteTestId}-0-save`));
      mockAxios.post.mockResolvedValueOnce(null);
    });

    await waitFor(() => {
      expect(mockAxios.put).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/activities/${mockedActivity.id}/notes/950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e`,
        {
          note: newNoteValue,
        },
        { signal: undefined },
      );
    });
  });

  test('should remove an existing note', async () => {
    mockGetWithNotes();
    renderFeedbackNotes();

    await waitFor(() => {
      const noteHeader = screen.queryByTestId(`${noteTestId}-0-header`) as HTMLElement;
      fireEvent.mouseEnter(noteHeader);
      const visibleRemoveAction = screen.queryByTestId(`${noteTestId}-0-remove`) as HTMLElement;
      fireEvent.click(visibleRemoveAction);
    });

    mockAxios.post.mockResolvedValueOnce(null);

    await waitFor(() => {
      expect(mockAxios.delete).nthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/activities/${mockedActivity.id}/notes/950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e`,

        { signal: undefined },
      );
    });
  });
});
