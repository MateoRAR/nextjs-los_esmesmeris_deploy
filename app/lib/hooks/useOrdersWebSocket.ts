"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Order } from '@/app/types/order';

const BACK_URL = process.env.NEXT_PUBLIC_BACK_URL || process.env.BACK_URL || 'http://localhost:3001';

// Detectar si estamos en Vercel o un entorno que no soporta WebSockets
const isVercelLike = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('vercel.com')
);

export function useOrdersWebSocket(
  onOrderUpdate?: (order: Order) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!BACK_URL) {
      setSocketError('BACK_URL no configurado');
      return;
    }

    // En Vercel o entornos sin WebSocket, usar solo polling
    const socket = io(BACK_URL, {
      // Forzar polling primero, luego websocket si está disponible
      transports: isVercelLike ? ['polling'] : ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      forceNew: false,
    });

    socketRef.current = socket;


    socket.on('connect', () => {
      setIsConnected(true);
      setSocketError(null);
      console.log('✅ Conexión establecida con el servidor');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Desconectado del servidor');
    });

    socket.on('connect_error', (error) => {
      // No mostrar como error crítico si estamos usando polling como alternativa
      if (isVercelLike) {
        setSocketError(null); // No mostrar error en Vercel, es esperado
        console.info('ℹ️ Usando polling HTTP (WebSockets no disponibles en este entorno)');
      } else {
        setSocketError(`Conexión: ${error.message}`);
        console.warn('⚠️ Error de WebSocket, usando polling como alternativa:', error.message);
      }
    });

    // Manejar errores de transporte
    socket.on('error', (error) => {
      if (!isVercelLike) {
        console.warn('⚠️ Error de Socket.IO:', error);
        setSocketError(`Socket: ${error.message || 'Error de conexión'}`);
      }
    });


    socket.on('orderUpdated', (order: Order) => {
      if (onOrderUpdate) {
        onOrderUpdate(order);
      }
    });

    // Fallback: polling manual si el socket no se conecta después de 5 segundos
    // O si estamos en un entorno Vercel-like, usar polling directamente
    let lastOrdersHash = '';
    const fallbackTimeout = setTimeout(() => {
      if ((!socket.connected || isVercelLike) && onOrderUpdate) {
        // Limpiar intentos de socket si estamos en Vercel
        if (isVercelLike && socket.connected) {
          socket.disconnect();
        }
        
        console.info('📡 Modo polling HTTP activado (actualización cada 5 segundos)');
        setSocketError(null); // No mostrar como error
        setIsConnected(true); // Marcar como "conectado" para UI
        
        // Función para hacer polling manual
        // Usa una API route de Next.js que maneja la autenticación del servidor
        const doManualPolling = async () => {
          try {
            const response = await fetch('/api/orders/poll', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Incluir cookies automáticamente
            });
            
            if (!response.ok) {
              if (response.status === 401) {
                setSocketError('Sesión expirada');
                setIsConnected(false);
                return;
              }
              throw new Error(`HTTP ${response.status}`);
            }
            
            const orders: Order[] = await response.json();
            // Crear hash simple para detectar cambios y evitar actualizaciones innecesarias
            const currentHash = JSON.stringify(
              orders.map(o => ({ id: o.id, status: o.status, lat: o.lat, lng: o.lng }))
            );
            
            // Solo notificar si hay cambios
            if (currentHash !== lastOrdersHash) {
              lastOrdersHash = currentHash;
              // Notificar todas las órdenes (la página del mapa manejará las actualizaciones)
              orders.forEach((order: Order) => {
                if (onOrderUpdate) {
                  onOrderUpdate(order);
                }
              });
            }
          } catch (error) {
            console.warn('⚠️ Error en polling:', error instanceof Error ? error.message : 'Error desconocido');
            // No establecer error crítico, solo logging
          }
        };

        // Polling cada 5 segundos
        doManualPolling();
        pollingIntervalRef.current = setInterval(doManualPolling, 5000);
      }
    }, isVercelLike ? 1000 : 5000); // Más rápido en Vercel ya que sabemos que WebSocket no funciona

    return () => {
      clearTimeout(fallbackTimeout);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
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

