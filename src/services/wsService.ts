// src/services/wsService.ts
// Controller helper: manages a WebSocket connection and dispatches events to a callback.

export type NewPostEvent = {
    type: 'post:new';
    postId: string;
  };
  
  // You can expand this union later for other event types:
  export type ServerEvent = NewPostEvent | { type: 'hello'; message: string };
  
  export function connectWebSocket(onEvent: (event: ServerEvent) => void): () => void {
    const ws = new WebSocket('ws://localhost:3001');
  
    ws.onopen = () => {
      console.log('[WS] connected');
    };
  
    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data as string) as ServerEvent;
        onEvent(data);
      } catch (err) {
        console.error('[WS] failed to parse message', err);
      }
    };
  
    ws.onerror = (err) => {
      console.error('[WS] error', err);
    };
  
    ws.onclose = () => {
      console.log('[WS] disconnected');
    };
  
    // return a cleanup function so React effects can close the connection
    return () => {
      ws.close();
    };
  }
  