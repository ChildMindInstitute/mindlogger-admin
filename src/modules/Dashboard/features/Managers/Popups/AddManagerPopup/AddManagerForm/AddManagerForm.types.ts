import { Control } from 'react-hook-form';

import { SubjectId } from 'api';
import { ParticipantSnippetInfo } from 'modules/Dashboard/components';
import { Roles } from 'shared/consts';

import { AddManagerFormValues } from '../AddManagerPopup.types';

export type AddManagerFormProps = {
  appletParticipants: (SubjectId & ParticipantSnippetInfo)[];
  appletRoles: Roles[];
  control: Control<AddManagerFormValues>;
  isWorkspaceNameVisible?: boolean;
  onSubmit: () => void;
  'data-testid'?: string;
};
