import { useEffect, useRef } from 'react';

import { useAppDispatch } from 'redux/store';
import { auth } from 'modules/Auth/state';
import { alerts } from 'shared/state';

import { getAlertFormValue, getWebsocketProtocol } from './alertsWebsocket.utils';
import { WEBSOCKET_ALERTS_API } from './alertsWebsocket.const';

export const useAlertsWebsocket = () => {
  const isAuthorized = auth.useAuthorized();
  const webSocketRef = useRef<null | WebSocket>();
  const dispatch = useAppDispatch();

  const startWebsocket = () => {
    const webSocket = new WebSocket(WEBSOCKET_ALERTS_API, [getWebsocketProtocol()]);
    webSocket.onmessage = (event: MessageEvent) => {
      const alert = getAlertFormValue(event.data);
      alert && dispatch(alerts.actions.addAlerts([alert]));
    };

    return webSocket;
  };
  const closeWebsocket = () => {
    webSocketRef.current?.close();
    webSocketRef.current = null;
  };

  useEffect(() => {
    if (!isAuthorized && webSocketRef.current) return closeWebsocket();
    if (!isAuthorized || (isAuthorized && webSocketRef.current)) return;

    webSocketRef.current = startWebsocket();
  }, [isAuthorized]);

  useEffect(() => closeWebsocket, []);

  return {
    startWebsocket,
  };
};
