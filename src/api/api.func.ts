import { BASE_API_URL } from './api.const';

export const getBaseUrl = () => sessionStorage.getItem('apiUrl') || BASE_API_URL;
