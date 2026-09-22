# Actor: Pisos particulares en Valencia (API Milanuncios)

Este actor usa **la API oficial de Milanuncios** para obtener pisos de alquiler en Valencia que cumplan:

- Máximo 1000 €
- Mínimo 2 habitaciones
- Mínimo 1 baño
- Solo particulares

## Ventajas

- Funciona en `LIMITED_PERMISSIONS`
- No depende de HTML dinámico
- No necesita navegador
- Resultados 100% reales

## Cómo usarlo

1. Crea un repositorio GitHub con:
   - `main.js`
   - `package.json`
   - `README.md`

2. En Apify → **Create Actor**
3. Selecciona **Connect GitHub repository**
4. Ejecuta el actor

## Salida

Cada anuncio tiene:

```json
{
  "source": "Milanuncios API",
  "price": 750,
  "rooms": 2,
  "baths": 1,
  "link": "https://www.milanuncios.com/..."
}
