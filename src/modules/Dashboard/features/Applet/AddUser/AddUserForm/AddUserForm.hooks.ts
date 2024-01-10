import { useEffect } from 'react';
import { FieldValues, Path } from 'react-hook-form';

import { ApiError } from 'shared/state';
import { getErrorData, getErrorMessage } from 'shared/utils';
import i18n from 'i18n';

import { Fields, NON_UNIQUE_VALUE_MESSAGE } from './AddUserForm.const';
import { UseFormError } from './AddUserForm.types';

const { t } = i18n;

export const useFormError = <T extends FieldValues>({
  error,
  setError,
  setHasCommonError,
}: UseFormError<T>) => {
  useEffect(() => {
    if (!error) return setHasCommonError(false);

    const errorData: ApiError = getErrorData(error);
    const fieldName = errorData?.path?.at?.(-1) as Path<T>;

    if (!fieldName || (fieldName && !Fields[fieldName as keyof typeof Fields]))
      return setHasCommonError(true);

    const errorMessage = getErrorMessage(error);
    const message =
      fieldName === Fields.secretUserId && errorMessage === NON_UNIQUE_VALUE_MESSAGE
        ? t('secretUserIdExists')
        : errorMessage;

    setError(fieldName, { message });
  }, [error]);
};
