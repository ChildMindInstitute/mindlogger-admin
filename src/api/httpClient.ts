import axios from 'axios';

// TODO: Make it changeable due to chosen host in dropdown, get from storage
const baseURL = 'https://api-staging.mindlogger.org/api/v1';

export const authHttpClient = axios.create({ baseURL });
export const httpClient = axios.create({ baseURL });

if (sessionStorage.getItem('accessToken')) {
  authHttpClient.defaults.headers['Girder-Token'] = sessionStorage.getItem('accessToken');
}
