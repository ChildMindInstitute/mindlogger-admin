import { FeedbackNote } from 'modules/Dashboard/api';

import { SelectedEntity } from '../Feedback.types';

export type FeedbackNotesProps = { entity: SelectedEntity };

export type Note = FeedbackNote & { isCurrentUserNote: boolean };
