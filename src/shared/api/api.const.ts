export enum ApiLanguages {
  EN = 'en',
  FR = 'fr',
  EL = 'el',
  ES = 'es',
  PT = 'pt',
  AF = 'af',
  XH = 'xh',
  ZU = 'zu',
}

export const DEFAULT_CONFIG = {
  headers: {
    'Mindlogger-Content-Source': 'admin',
  },
};

export const BASE_API_URL = import.meta.env.REACT_APP_API_DOMAIN;

export enum ApiResponseCodes {
  SuccessfulResponse = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  UnprocessableEntity = 422,
  NoContent = 204,
}

//getWorkspaceManagersApi, getWorkspaceRespondentsApi, getInvitationsApi (Add Users Tab)
// MFA recovery codes download - should handle 403 errors locally, not show global "No access to applet" popup
export const apiRoutesToSkip = [
  '^\\/workspaces\\/[0-9a-fA-F-]{36}\\/(managers|respondents)$',
  '^\\/workspaces\\/[0-9a-fA-F-]{36}\\/applets\\/[0-9a-fA-F-]{36}\\/(managers|respondents)$',
  '^\\/invitations$',
  '^\\/users\\/me\\/mfa\\/recovery-codes\\/download$',
];
