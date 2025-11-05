"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getOrders } from '@/app/actions/orders';
import { useOrdersWebSocket } from '@/app/lib/hooks/useOrdersWebSocket';
import { Order } from '@/app/types/order';
import { ArrowLeft, MapPin, Wifi, WifiOff, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spinner } from 'flowbite-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function OrdersMapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
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
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = getStatusColor(order.status);
        el.style.border = '3px solid white';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        el.style.transition = 'transform 0.2s';
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: true }).setHTML(`
          <div class="p-3 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
              <div class="w-3 h-3 rounded-full" style="background-color: ${getStatusColor(order.status)}"></div>
              <h3 class="font-bold text-sm text-gray-900">Orden #${order.id.slice(0, 8)}</h3>
            </div>
            <div class="space-y-1">
              ${order.type ? `<p class="text-xs text-gray-600"><span class="font-semibold">Tipo:</span> ${order.type}</p>` : ''}
              <p class="text-xs text-gray-600"><span class="font-semibold">Estado:</span> ${getStatusLabel(order.status)}</p>
              ${order.description ? `<p class="text-xs text-gray-600 mt-2"><span class="font-semibold">Descripción:</span><br/>${order.description}</p>` : ''}
            </div>
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_transit':
        return 'En Tránsito';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/orders')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a órdenes
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tracking de Órdenes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Visualización en tiempo real de las órdenes en el mapa
              </p>
            </div>
          </div>
        </div>

        {/* Error Card */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Token de Mapbox Requerido
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                Para visualizar el mapa de tracking, necesitas configurar tu token de Mapbox en las variables de entorno.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-3 mb-3">
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                  NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aquí
                </p>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                Obtén tu token gratuito en:
              </p>
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg hover:shadow-lg transition-all"
              >
                <MapPin className="w-4 h-4" />
                Obtener Token de Mapbox
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <button
              onClick={() => router.push('/orders')}
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a órdenes
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orderId ? `Tracking - Orden ${orderId.slice(0, 8)}` : 'Mapa de Tracking'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitoreo en tiempo real de órdenes
                </p>
              </div>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            {socketError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {socketError}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pendiente</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">En Tránsito</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entregado</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cancelado</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 z-10">
            <Spinner size="xl" className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando órdenes...</p>
          </div>
        ) : null}
        
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-20 p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md border-2 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-700 dark:text-red-400 text-lg mb-2">
                    Error al cargar el mapa
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-3">{mapError}</p>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Verifica que NEXT_PUBLIC_MAPBOX_TOKEN esté configurado correctamente en tu archivo .env.local
                </p>
              </div>
              <button
                onClick={() => router.push('/orders')}
                className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:shadow-lg transition-all"
              >
                Volver a Órdenes
              </button>
            </div>
          </div>
        )}
        
        {!mapLoaded && !mapError && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 z-10">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Inicializando mapa...</p>
          </div>
        )}
        
        <div 
          ref={mapContainer} 
          className="w-full h-full rounded-lg"
          style={{ minHeight: '400px', display: mapError ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}

