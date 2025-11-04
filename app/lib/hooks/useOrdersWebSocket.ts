"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Order } from '@/app/types/order';

const BACK_URL = process.env.BACK_URL

export function useOrdersWebSocket(
  onOrderUpdate?: (order: Order) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {

    const socket = io(BACK_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;


    socket.on('connect', () => {
      setIsConnected(true);
      setSocketError(null);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      setSocketError(error.message);
      console.error('WebSocket connection error:', error);
    });


    socket.on('orderUpdated', (order: Order) => {
      if (onOrderUpdate) {
        onOrderUpdate(order);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [onOrderUpdate]);

  const updateOrderLocation = (orderId: string, lat: number, lng: number) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('updateOrderLocation', {
        id: orderId,
        lat,
        lng,
      });
    }
  };

  return {
    isConnected,
    socketError,
    updateOrderLocation,
    socket: socketRef.current,
  };
}

