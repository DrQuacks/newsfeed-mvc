// src/hooks/useLiveUpdates.ts
// Controller hook: connects to the WebSocket and invalidates feed queries on new posts.

import { useEffect } from 'react';
import { connectWebSocket, type ServerEvent } from '@/services/wsService';
import { queryClient } from '@/lib/queryClient';

export function useLiveUpdates() {
  useEffect(() => {
    const disconnect = connectWebSocket((event: ServerEvent) => {
      if (event.type === 'post:new') {
        console.log('[WS] received post:new, invalidating feed queries');

        // Invalidate all queries that start with ['feed', ...]
        queryClient.invalidateQueries({
          queryKey: ['feed'],
        });
      }
    });

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);
}
