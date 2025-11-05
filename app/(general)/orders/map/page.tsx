"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getOrders } from '@/app/actions/orders';
import { useOrdersWebSocket } from '@/app/lib/hooks/useOrdersWebSocket';
import { Order } from '@/app/types/order';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function OrdersMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Initialize orders from server
  useEffect(() => {
    async function loadOrders() {
      try {
        const ordersData = await getOrders();
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Handle real-time order updates from WebSocket
  const handleOrderUpdate = useMemo(
    () => (updatedOrder: Order) => {
      setOrders((prevOrders) => {
        const existingIndex = prevOrders.findIndex((o) => o.id === updatedOrder.id);
        if (existingIndex >= 0) {
          // Update existing order
          const newOrders = [...prevOrders];
          newOrders[existingIndex] = updatedOrder;
          return newOrders;
        } else {
          // Add new order
          return [...prevOrders, updatedOrder];
        }
      });
    },
    []
  );

  // WebSocket connection
  const { isConnected, socketError } = useOrdersWebSocket(handleOrderUpdate);

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || map.current || !MAPBOX_TOKEN) {
      if (!MAPBOX_TOKEN) {
        console.error('Mapbox token no configurado');
      }
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-74.006, 40.7128], // Default to NYC, you can change this
        zoom: 10,
        attributionControl: false,
      });

      // Manejar errores de carga del mapa
      map.current.on('error', (e) => {
        console.error('Error de Mapbox:', e);
        let errorMessage = 'Error al cargar el mapa';
        
        if (e.error && e.error.message) {
          console.error('Mensaje de error:', e.error.message);
          if (e.error.message.includes('token') || e.error.message.includes('401')) {
            errorMessage = 'Token de Mapbox inválido o no autorizado. Verifica NEXT_PUBLIC_MAPBOX_TOKEN';
          } else if (e.error.message.includes('style')) {
            errorMessage = 'Error al cargar el estilo del mapa';
          } else {
            errorMessage = `Error: ${e.error.message}`;
          }
        }
        
        setMapError(errorMessage);
      });

      // Esperar a que el mapa esté listo antes de agregar controles
      map.current.on('load', () => {
        console.log('Mapa de Mapbox cargado correctamente');
        setMapLoaded(true);
        setMapError(null);
        if (map.current) {
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
          map.current.addControl(new mapboxgl.AttributionControl({
            compact: true
          }), 'bottom-right');
        }
      });

      // Manejar errores de estilo
      map.current.on('style.load', () => {
        console.log('Estilo del mapa cargado');
      });
      
      // Timeout para detectar si el mapa no carga
      const loadTimeout = setTimeout(() => {
        if (map.current && !map.current.loaded()) {
          setMapError('El mapa está tardando en cargar. Verifica tu conexión y el token de Mapbox.');
        }
      }, 10000);

      // Cleanup function
      return () => {
        clearTimeout(loadTimeout);
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };

    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      setMapError('Error al inicializar el mapa. Verifica la consola para más detalles.');
    }
  }, [MAPBOX_TOKEN]);

  // Update markers when orders change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for orders with valid coordinates
    orders.forEach((order) => {
      if (order.lat != null && order.lng != null && order.lat !== 0 && order.lng !== 0) {
        const el = document.createElement('div');
        el.className = 'order-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = getStatusColor(order.status);
        el.style.border = '2px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">Orden ${order.id.slice(0, 8)}</h3>
            <p class="text-xs text-gray-600">Tipo: ${order.type}</p>
            <p class="text-xs text-gray-600">Estado: ${order.status}</p>
            ${order.description ? `<p class="text-xs text-gray-600">${order.description}</p>` : ''}
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([order.lng, order.lat])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.set(order.id, marker);
      }
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.size > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markersRef.current.forEach((marker) => {
        const lngLat = marker.getLngLat();
        bounds.extend([lngLat.lng, lngLat.lat]);
      });
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [orders, map.current]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#fbbf24'; // yellow
      case 'in_transit':
        return '#3b82f6'; // blue
      case 'delivered':
        return '#10b981'; // green
      case 'cancelled':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-bold">Mapbox Token Requerido</p>
          <p className="text-sm">
            Por favor, configura NEXT_PUBLIC_MAPBOX_TOKEN en tu archivo .env.local
          </p>
          <p className="text-sm mt-2">
            Obtén tu token en: <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="underline">https://account.mapbox.com/access-tokens/</a>
          </p>
          <p className="text-sm mt-2">
            También asegúrate de tener BACK_URL configurado para la conexión WebSocket
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mapa de Órdenes</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            {socketError && (
              <span className="text-sm text-red-600">{socketError}</span>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>En Tránsito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Entregado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Cancelado</span>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-600">Cargando órdenes...</div>
          </div>
        ) : null}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-20 border-2 border-red-200">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <p className="font-bold text-red-700 mb-2">Error al cargar el mapa</p>
              <p className="text-sm text-red-600 mb-4">{mapError}</p>
              <p className="text-xs text-gray-600">
                Verifica que NEXT_PUBLIC_MAPBOX_TOKEN esté configurado correctamente en tu .env.local
              </p>
            </div>
          </div>
        )}
        {!mapLoaded && !mapError && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-600">Cargando mapa...</div>
          </div>
        )}
        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{ minHeight: '400px', display: mapError ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}

