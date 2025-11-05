# Sugerencias de Endpoints para Backend - Dashboard Analytics

Este documento contiene sugerencias de endpoints adicionales que mejorarían significativamente las capacidades de reporting y análisis del dashboard.

## 1. Análisis de Tendencias de Ventas

### `GET /sales/trends`
**Descripción**: Obtener tendencias de ventas por período de tiempo

**Query Parameters**:
- `period`: `daily` | `weekly` | `monthly` | `yearly`
- `startDate`: Fecha inicio (ISO 8601)
- `endDate`: Fecha fin (ISO 8601)

**Response**:
```json
{
  "data": [
    {
      "period": "2024-01-15",
      "totalSales": 45,
      "totalRevenue": 12500.50,
      "averageTicket": 277.79,
      "completionRate": 0.92
    }
  ]
}
```

**Beneficio**: Permite análisis de tendencias más precisos y comparaciones entre períodos.

---

## 2. Dashboard de Métricas Consolidado

### `GET /dashboard/metrics`
**Descripción**: Endpoint optimizado que retorna todas las métricas del dashboard en una sola llamada

**Query Parameters**:
- `period`: `7days` | `30days` | `90days` | `year` (opcional, por defecto 30 días)

**Response**:
```json
{
  "summary": {
    "totalSales": 250,
    "totalRevenue": 125000.00,
    "totalCustomers": 89,
    "totalProducts": 150,
    "averageOrderValue": 500.00,
    "lowStockProducts": 12
  },
  "salesStatus": {
    "completed": 230,
    "pending": 15,
    "cancelled": 5
  },
  "topProducts": [
    {
      "id": "uuid",
      "name": "Producto A",
      "unitsSold": 120,
      "revenue": 15000.00
    }
  ],
  "topCustomers": [
    {
      "id": "uuid",
      "name": "Cliente X",
      "totalPurchases": 25,
      "totalSpent": 12500.00
    }
  ],
  "salesByDay": [
    {
      "date": "2024-01-15",
      "sales": 12,
      "revenue": 6000.00
    }
  ]
}
```

**Beneficio**: Reduce el número de llamadas HTTP y mejora el performance del dashboard.

---

## 3. Productos con Stock Bajo

### `GET /products/low-stock`
**Descripción**: Obtener productos que necesitan reabastecimiento

**Query Parameters**:
- `threshold`: Cantidad mínima de stock (por defecto 10)
- `limit`: Número de resultados (por defecto 20)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Producto X",
      "currentStock": 5,
      "recommendedStock": 50,
      "unitsSoldLastMonth": 45,
      "status": "critical"
    }
  ]
}
```

**Beneficio**: Alertas proactivas para gestión de inventario.

---

## 4. Performance de Empleados

### `GET /sales/by-employee`
**Descripción**: Estadísticas de ventas por empleado

**Query Parameters**:
- `startDate`: Fecha inicio
- `endDate`: Fecha fin
- `employeeId`: ID del empleado (opcional, para detalle individual)

**Response**:
```json
{
  "data": [
    {
      "employeeId": "uuid",
      "employeeName": "Juan Pérez",
      "totalSales": 85,
      "totalRevenue": 42500.00,
      "averageTicket": 500.00,
      "conversionRate": 0.75
    }
  ]
}
```

**Beneficio**: Evaluación de performance y rankings de vendedores.

---

## 5. Resumen de Ingresos

### `GET /dashboard/revenue-summary`
**Descripción**: Análisis detallado de ingresos y márgenes

**Query Parameters**:
- `period`: `month` | `quarter` | `year`

**Response**:
```json
{
  "totalRevenue": 125000.00,
  "costOfGoodsSold": 75000.00,
  "grossProfit": 50000.00,
  "grossMargin": 0.40,
  "revenueByCategory": [
    {
      "category": "Electrónica",
      "revenue": 50000.00,
      "percentage": 0.40
    }
  ],
  "revenueByPaymentMethod": [
    {
      "method": "card",
      "revenue": 80000.00,
      "percentage": 0.64
    }
  ]
}
```

**Beneficio**: Análisis financiero profundo y proyecciones.

---

## 6. Retención de Clientes

### `GET /customers/retention`
**Descripción**: Métricas de retención y recurrencia de clientes

**Query Parameters**:
- `period`: `month` | `quarter` | `year`

**Response**:
```json
{
  "newCustomers": 25,
  "returningCustomers": 64,
  "churnRate": 0.15,
  "retentionRate": 0.85,
  "averagePurchaseFrequency": 3.5,
  "customerLifetimeValue": 2500.00,
  "topLoyalCustomers": [
    {
      "customerId": "uuid",
      "name": "Cliente Fiel",
      "purchaseCount": 45,
      "totalSpent": 22500.00,
      "lastPurchase": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Beneficio**: Estrategias de fidelización y análisis de comportamiento.

---

## 7. Análisis de Productos

### `GET /products/analytics`
**Descripción**: Estadísticas avanzadas de productos

**Response**:
```json
{
  "fastMovingProducts": [
    {
      "id": "uuid",
      "name": "Producto Popular",
      "stockTurnoverRate": 8.5,
      "daysInInventory": 12
    }
  ],
  "slowMovingProducts": [
    {
      "id": "uuid",
      "name": "Producto Lento",
      "stockTurnoverRate": 0.5,
      "daysInInventory": 180
    }
  ],
  "outOfStockProducts": [
    {
      "id": "uuid",
      "name": "Producto Agotado",
      "lastStockDate": "2024-01-01",
      "lostSalesEstimate": 15
    }
  ]
}
```

**Beneficio**: Optimización de inventario y decisiones de compra.

---

## 8. Comparación de Períodos

### `GET /dashboard/period-comparison`
**Descripción**: Comparar métricas entre dos períodos

**Query Parameters**:
- `currentStartDate`: Inicio período actual
- `currentEndDate`: Fin período actual
- `previousStartDate`: Inicio período anterior
- `previousEndDate`: Fin período anterior

**Response**:
```json
{
  "current": {
    "totalSales": 100,
    "totalRevenue": 50000.00
  },
  "previous": {
    "totalSales": 85,
    "totalRevenue": 42500.00
  },
  "changes": {
    "salesChange": 15,
    "salesChangePercentage": 17.65,
    "revenueChange": 7500.00,
    "revenueChangePercentage": 17.65
  }
}
```

**Beneficio**: Análisis de crecimiento y detección de tendencias.

---

## 9. Alertas y Notificaciones

### `GET /dashboard/alerts`
**Descripción**: Alertas importantes del negocio

**Response**:
```json
{
  "alerts": [
    {
      "id": "uuid",
      "type": "low_stock",
      "severity": "critical",
      "message": "5 productos con stock crítico",
      "actionRequired": true,
      "timestamp": "2024-01-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "type": "high_pending_sales",
      "severity": "warning",
      "message": "15 ventas pendientes por más de 3 días",
      "actionRequired": true,
      "timestamp": "2024-01-15T09:30:00Z"
    }
  ]
}
```

**Beneficio**: Gestión proactiva y prevención de problemas.

---

## 10. Exportación de Reportes

### `POST /reports/generate`
**Descripción**: Generar reportes personalizados en PDF o Excel

**Request Body**:
```json
{
  "reportType": "sales" | "inventory" | "customers" | "financial",
  "format": "pdf" | "excel",
  "dateRange": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "filters": {
    "employeeId": "uuid",
    "customerId": "uuid",
    "productCategory": "electronics"
  }
}
```

**Response**:
```json
{
  "reportId": "uuid",
  "downloadUrl": "https://api.example.com/reports/download/uuid",
  "expiresAt": "2024-01-16T10:00:00Z"
}
```

**Beneficio**: Reportes profesionales para stakeholders.

---

## Priorización Sugerida

**Alta Prioridad (Implementar primero)**:
1. `GET /dashboard/metrics` - Mejora inmediata de performance
2. `GET /products/low-stock` - Operación crítica
3. `GET /sales/trends` - Valor analítico alto

**Media Prioridad**:
4. `GET /sales/by-employee` - Gestión de equipo
5. `GET /customers/retention` - Estrategia comercial
6. `GET /dashboard/alerts` - Prevención de problemas

**Baja Prioridad (Futuro)**:
7. `GET /dashboard/revenue-summary` - Análisis avanzado
8. `GET /products/analytics` - Optimización
9. `GET /dashboard/period-comparison` - Insights adicionales
10. `POST /reports/generate` - Característica premium

---

## Consideraciones Técnicas

### Performance
- Implementar caché para endpoints de dashboard (5-15 minutos)
- Usar paginación en endpoints que retornan listas grandes
- Considerar agregaciones pre-calculadas para períodos cerrados

### Seguridad
- Todos los endpoints requieren autenticación JWT
- Implementar rate limiting (100 requests/minuto por usuario)
- Filtrar datos según rol del usuario (empleados solo ven sus propias ventas)

### Documentación
- Usar Swagger/OpenAPI para documentación interactiva
- Incluir ejemplos de request/response
- Documentar códigos de error específicos

### Versionado
- Usar versionado de API: `/api/v1/dashboard/metrics`
- Mantener compatibilidad hacia atrás por al menos 6 meses
