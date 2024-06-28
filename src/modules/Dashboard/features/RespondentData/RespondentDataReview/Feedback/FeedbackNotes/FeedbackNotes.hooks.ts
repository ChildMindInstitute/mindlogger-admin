import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  const commonApiParams = useMemo(
    () =>
      appletId && id
        ? {
            appletId,
            ...(isFlow && submitId && { submitId, flowId: id }),
            ...(!isFlow &&
              answerId && {
                answerId,
                activityId: id,
              }),
          }
        : null,
    [appletId, isFlow, submitId, answerId, id],
  );

  const updateListOfNotes = useCallback(() => {
    if (!commonApiParams) return;

    getNotes({
      ...commonApiParams,
      params: {},
    });
  }, [getNotes, commonApiParams]);

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
    if (!commonApiParams) return;

    editNote({
      ...commonApiParams,
      noteId: updatedNote.id,
      note: updatedNote.note,
    });
  };

  const handleNoteDelete = (noteId: string) => {
    if (!commonApiParams) return;

    deleteNote({ ...commonApiParams, noteId });
  };

  const addNewNote = ({ newNote }: FeedbackForm) => {
    if (!newNote.trim() || !commonApiParams) return;

    createNote({ ...commonApiParams, note: newNote });
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
