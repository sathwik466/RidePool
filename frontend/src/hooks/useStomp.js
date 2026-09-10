import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getWsUrl } from '../api/client';

export function useStomp(enabled = true) {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(getWsUrl()),
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [enabled]);

  const subscribe = useCallback(
    (destination, callback) => {
      const client = clientRef.current;
      if (!client?.connected) return () => {};

      const sub = client.subscribe(destination, (frame) => {
        callback(JSON.parse(frame.body));
      });

      return () => sub.unsubscribe();
    },
    [connected]
  );

  const publish = useCallback(
    (destination, body) => {
      clientRef.current?.publish({
        destination,
        body: JSON.stringify(body),
      });
    },
    []
  );

  return { connected, subscribe, publish };
}
