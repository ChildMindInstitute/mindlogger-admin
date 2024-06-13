import { useContext, useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { useAsync } from 'shared/hooks/useAsync';
import { getNotesApi, createNoteApi, editNoteApi, deleteNoteApi } from 'modules/Dashboard/api';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback';
import { auth } from 'modules/Auth/state';

import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { FeedbackNotesProps, Note } from './FeedbackNotes.types';

export const useFeedbackNotes = ({ entity: { id, isFlow } }: FeedbackNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { appletId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const submitId = searchParams.get('submitId');
  const { user } = auth.useData() ?? {};

  const { isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const { setValue, handleSubmit } = useFormContext<FeedbackForm>();

  const { execute: getNotes, isLoading: getNotesLoading } = useAsync(
    getNotesApi,
    (res) =>
      res?.data?.result &&
      setNotes(
        res.data.result.map((note) => ({
          ...note,
          isCurrentUserNote: user?.id === note.user.id,
        })),
      ),
  );

  const updateListOfNotes = useCallback(() => {
    if (!appletId || !id) return;

    const commonParams = { appletId, params: {} };

    if (isFlow && submitId) {
      getNotes({ ...commonParams, submitId, flowId: id });
    } else if (answerId) {
      getNotes({ ...commonParams, answerId, activityId: id });
    }
  }, [appletId, id, isFlow, submitId, answerId, getNotes]);

  const handleUpdateNote = () => {
    setValue('newNote', '');
    updateListOfNotes();
  };

  const { execute: createNote, isLoading: createNoteLoading } = useAsync(
    createNoteApi,
    handleUpdateNote,
  );
  const { execute: editNote, isLoading: editNoteLoading } = useAsync(
    editNoteApi,
    updateListOfNotes,
  );
  const { execute: deleteNote, isLoading: deleteNoteLoading } = useAsync(
    deleteNoteApi,
    updateListOfNotes,
  );

  const isLoading = getNotesLoading || editNoteLoading || deleteNoteLoading || createNoteLoading;

  const handleNoteEdit = (updatedNote: Pick<Note, 'id' | 'note'>) => {
    if (!appletId || !id) return;

    const commonParams = {
      appletId,
      noteId: updatedNote.id,
      note: updatedNote.note,
    };

    if (isFlow && submitId) {
      editNote({ ...commonParams, submitId, flowId: id });
    } else if (answerId) {
      editNote({
        ...commonParams,
        answerId,
        activityId: id,
      });
    }
  };

  const handleNoteDelete = (noteId: string) => {
    if (!appletId || !id) return;

    const commonParams = { appletId, noteId };

    if (isFlow && submitId) {
      deleteNote({ ...commonParams, submitId, flowId: id });
    } else if (answerId) {
      deleteNote({ ...commonParams, answerId, activityId: id });
    }
  };

  const addNewNote = ({ newNote }: FeedbackForm) => {
    if (!newNote.trim() || !appletId || !id) return;

    const commonParams = { appletId, note: newNote };

    if (isFlow && submitId) {
      createNote({ ...commonParams, submitId, flowId: id });
    } else if (answerId) {
      createNote({ ...commonParams, answerId, activityId: id });
    }
  };

  useEffect(() => {
    if (!isFeedbackOpen) return;

    updateListOfNotes();
  }, [isFeedbackOpen, updateListOfNotes]);

  return {
    notes,
    isLoading,
    handleSubmit: handleSubmit(addNewNote),
    handleNoteEdit,
    handleNoteDelete,
  };
};
