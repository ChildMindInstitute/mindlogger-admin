import { applet } from 'shared/state';
import { ErrorResponseType } from 'shared/types';

export const useCheckIfAppletHasNotFoundError = () => {
  const appletError = applet.useResponseError() ?? [];

  return (
    Array.isArray(appletError) &&
    appletError.some((error) => error.type === ErrorResponseType.NotFound)
  );
};
