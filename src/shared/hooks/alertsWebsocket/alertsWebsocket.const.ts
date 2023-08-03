import { BASE_API_URL } from 'shared/api';

const baseUrl = new URL(BASE_API_URL ?? '');
const hostname = baseUrl.hostname;
export const WEBSOCKET_ALERTS_API = `wss://${hostname}/ws/alerts`;
