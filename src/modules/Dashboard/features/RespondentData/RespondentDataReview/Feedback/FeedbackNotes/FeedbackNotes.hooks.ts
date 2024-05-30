import { useContext, useEffect, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { useAsync } from 'shared/hooks/useAsync';
import {
  createAnswerNoteApi,
  deleteAnswerNoteApi,
  editAnswerNoteApi,
  getAnswersNotesApi,
  getFlowNotesApi,
  deleteFlowNoteApi,
  editFlowNoteApi,
  createFlowNoteApi,
  FeedbackNote as FeedbackNoteType,
} from 'modules/Dashboard/api';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback';

import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { FeedbackNotesProps } from './FeedbackNotes.types';

export const useFeedbackNotes = ({ entity: { id, isFlow } }: FeedbackNotesProps) => {
  const [notes, setNotes] = useState<FeedbackNoteType[]>([]);
  const { appletId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const submitId = searchParams.get('submitId');

  const { isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const { setValue, handleSubmit } = useFormContext<FeedbackForm>();

  const { execute: getAnswersNotes, isLoading: notesLoading } = useAsync(
    getAnswersNotesApi,
    (res) => res?.data?.result && setNotes(res.data.result),
  );
  const { execute: getFlowNotes, isLoading: flowNotesLoading } = useAsync(
    getFlowNotesApi,
    (res) => res?.data?.result && setNotes(res.data.result),
  );

  const updateListOfNotes = useCallback(() => {
    if (!appletId || !id) return;

    const commonParams = { appletId, params: {} };

    if (isFlow && submitId) {
      getFlowNotes({ ...commonParams, submitId, flowId: id });

      return;
    }

    if (!answerId) return;

    getAnswersNotes({ ...commonParams, answerId, activityId: id });
  }, [appletId, id, isFlow, submitId, answerId, getFlowNotes, getAnswersNotes]);

  const handleUpdateNote = () => {
    setValue('newNote', '');
    updateListOfNotes();
  };

  const { execute: createAnswerNote, isLoading: createNoteLoading } = useAsync(
    createAnswerNoteApi,
    handleUpdateNote,
  );
  const { execute: createFlowNote, isLoading: createFlowNoteLoading } = useAsync(
    createFlowNoteApi,
    handleUpdateNote,
  );
  const { execute: editAnswerNote, isLoading: editNoteLoading } = useAsync(
    editAnswerNoteApi,
    updateListOfNotes,
  );
  const { execute: editFlowNote, isLoading: editFlowNoteLoading } = useAsync(
    editFlowNoteApi,
    updateListOfNotes,
  );
  const { execute: deleteAnswerNote, isLoading: deleteNoteLoading } = useAsync(
    deleteAnswerNoteApi,
    updateListOfNotes,
  );
  const { execute: deleteFlowNote, isLoading: deleteFlowNoteLoading } = useAsync(
    deleteFlowNoteApi,
    updateListOfNotes,
  );

  const isLoading =
    notesLoading ||
    flowNotesLoading ||
    editNoteLoading ||
    editFlowNoteLoading ||
    deleteNoteLoading ||
    deleteFlowNoteLoading ||
    createNoteLoading ||
    createFlowNoteLoading;

  const handleNoteEdit = (updatedNote: Pick<FeedbackNoteType, 'id' | 'note'>) => {
    if (!appletId || !id) return;

    const commonParams = {
      appletId,
      noteId: updatedNote.id,
      note: updatedNote.note,
    };

    if (isFlow && submitId) {
      editFlowNote({ ...commonParams, submitId, flowId: id });

      return;
    }

    if (!answerId) return;

    editAnswerNote({
      ...commonParams,
      answerId,
      activityId: id,
    });
  };

  const handleNoteDelete = (noteId: string) => {
    if (!appletId || !id) return;

    const commonParams = { appletId, noteId };

    if (isFlow && submitId) {
      deleteFlowNote({ ...commonParams, submitId, flowId: id });

      return;
    }

    if (!answerId) return;

    deleteAnswerNote({ ...commonParams, answerId, activityId: id });
  };

  const addNewNote = ({ newNote }: FeedbackForm) => {
    if (!newNote.trim() || !appletId || !id) return;

    const commonParams = { appletId, note: newNote };

    if (isFlow && submitId) {
      createFlowNote({ ...commonParams, submitId, flowId: id });

      return;
    }

    if (!answerId) return;

    createAnswerNote({ ...commonParams, answerId, activityId: id });
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
