import { AxiosError } from 'axios';
import { UseFormSetError, FieldValues } from 'react-hook-form';

import { Option } from 'shared/components/FormComponents';
import { Roles } from 'shared/consts';
import { ApiErrorResponse } from 'shared/state';

export type FormValues = {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  secretUserId?: string;
  workspacePrefix?: string;
  role: string;
  language?: string;
  respondents?: { label: string; id: string }[];
};

export type Field = { name: keyof FormValues; options?: Option[]; 'data-testid'?: string };

export type AddUserFormProps = {
  getInvitationsHandler: () => void;
  roles?: Roles[];
};

export type WorkspaceInfo = {
  hasManagers: boolean;
  name: string;
};

export type UseFormError<T extends FieldValues> = {
  error: AxiosError<ApiErrorResponse> | null;
  setError: UseFormSetError<T>;
};
