export enum ApiLanguages {
  EN = 'en',
  FR = 'fr',
  EL = 'el',
  ES = 'es',
}

export const DEFAULT_CONFIG = {
  headers: {
    'Mindlogger-Content-Source': 'admin',
  },
};

export const BASE_API_URL = process.env.REACT_APP_API_DOMAIN;

export enum ApiResponseCodes {
  SuccessfulResponse = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  UnprocessableEntity = 422,
  NoContent = 204,
}

//getWorkspaceManagersApi, getWorkspaceRespondentsApi, getInvitationsApi (Add Users Tab)
export const apiRoutesToSkip = [
  '^\\/workspaces\\/[0-9a-fA-F-]{36}\\/(managers|respondents)$',
  '^\\/workspaces\\/[0-9a-fA-F-]{36}\\/applets\\/[0-9a-fA-F-]{36}\\/(managers|respondents)$',
  '^\\/invitations$',
];
