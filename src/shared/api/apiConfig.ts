import axios from 'axios';

import { DEFAULT_CONFIG } from './api.const';

export const apiClient = axios.create(DEFAULT_CONFIG);
export const authApiClient = axios.create(DEFAULT_CONFIG);
export const authApiClientWithoutRefresh = axios.create(DEFAULT_CONFIG);
