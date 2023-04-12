import { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react';
import { AxiosError } from 'axios';
import { ApiError } from 'shared/state';

export type DeleteAppletWithPasswordProps = {
  onSubmit: (data: DeleteAppletWithPasswordFormValues) => void;
};

export type DeleteAppletWithPasswordRef = {
  onSubmit: (e?: BaseSyntheticEvent) => void;
  setError: Dispatch<SetStateAction<null | AxiosError<ApiError>>>;
};

export type DeleteAppletWithPasswordFormValues = {
  password: string;
};
