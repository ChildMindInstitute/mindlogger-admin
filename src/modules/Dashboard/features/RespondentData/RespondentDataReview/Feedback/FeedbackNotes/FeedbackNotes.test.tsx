import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import userEvent from '@testing-library/user-event';

import { waitForTheUpdate } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedFullSubjectId1,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import { ApiResponseCodes } from 'api';

import { FeedbackNotes } from './FeedbackNotes';
import { FeedbackForm, SelectedEntity } from '../Feedback.types';
import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { RespondentDataReviewContextType } from '../../RespondentDataReview.types';

const noteTestId = 'respondents-summary-feedback-notes-note';
const newNoteValue = 'New note has been added';
const mockedAnswerId = 'some-answer-id';
const mockedSubmitId = 'some-submit-id';
const routeWithAnswerId = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/responses?selectedDate=2023-11-27&answerId=${mockedAnswerId}`;
const routeWithSubmitId = `/dashboard/${mockedAppletId}/participants/${mockedFullSubjectId1}/dataviz/responses?selectedDate=2023-11-27&submitId=${mockedSubmitId}`;
const routePath = page.appletParticipantDataReview;
const firstUserId = 'user-id-1';
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
  auth: {
    authentication: {
      ...initialStateData,
      data: {
        user: {
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          id: firstUserId,
        },
      },
    },
    isAuthorized: true,
    isLogoutInProgress: false,
  },
};

const mockedActivity = {
  id: 'some-activity-id',
  isFlow: false,
};
const mockedFlow = {
  id: 'some-flow-id',
  isFlow: true,
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
          id: firstUserId,
        },
        note: 'New note',
        createdAt: '2023-11-29T12:14:58.395686',
      },
      {
        id: '4eb2f59a-e0ba-464c-b3c7-fb4c3a2e3ac0',
        user: {
          firstName: 'Jane',
          lastName: 'Doe',
          id: 'user-id-2',
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

const renderFeedbackNotes = (entity: SelectedEntity, route: string) =>
  renderWithProviders(
    <RespondentDataReviewContext.Provider
      value={{ isFeedbackOpen: true } as RespondentDataReviewContextType}
    >
      <FormComponent>{<FeedbackNotes entity={entity} />}</FormComponent>
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

const testNotesRender = async () =>
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

const testNoteCreation = async (apiCallRoute: string) => {
  // wait for the isLoading process of getAnswersNotes to become false
  await waitForTheUpdate();

  await userEvent.type(screen.getByLabelText(/Add a New Note/i), newNoteValue);
  await userEvent.click(screen.getByTestId('respondents-summary-feedback-notes-save'));
  mockAxios.post.mockResolvedValueOnce(null);

  await waitFor(() => {
    expect(mockAxios.post).nthCalledWith(
      1,
      apiCallRoute,
      {
        note: newNoteValue,
      },
      { signal: undefined },
    );
  });
};

const testNoteEditing = async (apiCallRoute: string) => {
  await waitFor(async () => {
    const hiddenEditAction = screen.queryByTestId(`${noteTestId}-0-edit`);

    expect(hiddenEditAction).toBeNull();

    const noteHeader = screen.queryByTestId(`${noteTestId}-0-header`) as HTMLElement;
    await userEvent.hover(noteHeader);
    const visibleEditAction = screen.queryByTestId(`${noteTestId}-0-edit`) as HTMLElement;

    expect(visibleEditAction).toBeInTheDocument();

    await userEvent.click(visibleEditAction);
  });

  await waitFor(async () => {
    const noteContainer = screen.queryByTestId(`${noteTestId}-0-text`) as HTMLElement;
    const textarea = noteContainer.querySelector('textarea') as HTMLElement;
    await userEvent.clear(textarea);
    await userEvent.type(textarea, newNoteValue);
    await userEvent.click(screen.getByTestId(`${noteTestId}-0-save`));
    mockAxios.post.mockResolvedValueOnce(null);
  });

  await waitFor(() => {
    expect(mockAxios.put).nthCalledWith(
      1,
      apiCallRoute,
      {
        note: newNoteValue,
      },
      { signal: undefined },
    );
  });
};

const testNoteRemoving = async (apiCallRoute: string) => {
  await waitFor(async () => {
    const noteHeader = screen.queryByTestId(`${noteTestId}-0-header`) as HTMLElement;

    expect(noteHeader).toBeInTheDocument();

    await userEvent.hover(noteHeader);
    const visibleRemoveAction = screen.queryByTestId(`${noteTestId}-0-remove`) as HTMLElement;

    expect(visibleRemoveAction).toBeInTheDocument();

    await userEvent.click(visibleRemoveAction);
  });

  mockAxios.post.mockResolvedValueOnce(null);

  await waitFor(() => {
    expect(mockAxios.delete).nthCalledWith(
      1,
      apiCallRoute,

      { signal: undefined },
    );
  });
};

describe('FeedbackNotes', () => {
  test('should render array of notes for Activity answer', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedActivity, routeWithAnswerId);

    await testNotesRender();
  });

  test('should render array of notes for Flow submission', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedFlow, routeWithSubmitId);

    await testNotesRender();
  });

  test('should save new note for Activity answer', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedActivity, routeWithAnswerId);

    await testNoteCreation(
      `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/activities/${mockedActivity.id}/notes`,
    );
  });

  test('should save new note for Flow submission', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedFlow, routeWithSubmitId);

    await testNoteCreation(
      `/answers/applet/${mockedAppletId}/submissions/${mockedSubmitId}/flows/${mockedFlow.id}/notes`,
    );
  });

  test('should edit an existing note for Activity answer', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedActivity, routeWithAnswerId);

    await testNoteEditing(
      `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/activities/${mockedActivity.id}/notes/950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e`,
    );
  });

  test('should edit an existing note for Flow submission', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedFlow, routeWithSubmitId);

    await testNoteEditing(
      `/answers/applet/${mockedAppletId}/submissions/${mockedSubmitId}/flows/${mockedFlow.id}/notes/950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e`,
    );
  });

  test('should remove an existing note for Activity answer', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedActivity, routeWithAnswerId);

    await testNoteRemoving(
      `/answers/applet/${mockedAppletId}/answers/${mockedAnswerId}/activities/${mockedActivity.id}/notes/950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e`,
    );
  });

  test('should remove an existing note for Flow submission', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedFlow, routeWithSubmitId);

    await testNoteRemoving(
      `/answers/applet/${mockedAppletId}/submissions/${mockedSubmitId}/flows/${mockedFlow.id}/notes/950fe4cc-dddb-4b5f-bdb5-4f3966dbed7e`,
    );
  });

  test('should hide remove and edit options for notes not created by the current user', async () => {
    mockGetWithNotes();
    renderFeedbackNotes(mockedFlow, routeWithSubmitId);

    await waitFor(async () => {
      const noteHeader = screen.queryByTestId(`${noteTestId}-1-header`) as HTMLElement;

      expect(noteHeader).toBeInTheDocument();

      await userEvent.hover(noteHeader);
      const editAction = screen.queryByTestId(`${noteTestId}-1-edit`) as HTMLElement;
      const removeAction = screen.queryByTestId(`${noteTestId}-1-remove`) as HTMLElement;

      expect(editAction).not.toBeInTheDocument();
      expect(removeAction).not.toBeInTheDocument();
    });
  });
});
