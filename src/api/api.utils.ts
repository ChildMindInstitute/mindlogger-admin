import { AxiosRequestConfig } from 'axios';

import { BASE_API_URL, LANGUAGES } from './api.const';

export const getBaseUrl = () => sessionStorage.getItem('apiUrl') || BASE_API_URL;

export const getRequestTokenData = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers['Girder-Token'] = sessionStorage.getItem('accessToken');
};

export const getRequestLangData = (config: AxiosRequestConfig) => {
  if (!config.params) {
    config.params = {};
  }
  config.params.lang = sessionStorage.getItem('lang') || 'en';
};

export const getRequestFullLangData = (config: AxiosRequestConfig) => {
  if (!config.params) config.params = {};
  const lang = (sessionStorage.getItem('lang') || 'en') as 'en' | 'fr';

  config.params.lang = LANGUAGES[lang] as string;
};

export const attachUrl = (origin: string, resource: string) => {
  if (origin.endsWith('/')) {
    return origin + resource;
  }
  return `${origin}/${resource}`;
};
