import { applet } from 'shared/state';
import { ErrorResponseType } from 'shared/api';

export const useCheckIfAppletHasNotFoundError = () => {
  const appletError = applet.useResponseError() ?? [];

  return appletError.some((error) => error.type === ErrorResponseType.NotFound);
};
