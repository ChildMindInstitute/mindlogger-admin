export enum Languages {
  EN = 'en',
  FR = 'fr',
}

export const regionalLangFormats = {
  [Languages.EN]: 'en-US',
  [Languages.FR]: 'fr-FR',
};

export const DEFAULT_CONFIG = {
  headers: {
    'Mindlogger-Content-Source': 'admin',
  },
};

export const BASE_API_URL = process.env.REACT_APP_API_DOMAIN;

export const LANGUAGES: { en: string; fr: string } = {
  en: 'en_US',
  fr: 'fr_FR',
};

export enum ApiResponseCodes {
  SuccessfulResponse = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  UnprocessableEntity = 422,
  NoContent = 204,
}
