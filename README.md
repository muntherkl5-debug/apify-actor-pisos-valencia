# Actor: Pisos de alquiler en Valencia (solo particulares)

Este actor busca pisos de alquiler en Valencia que cumplan:

- Máximo 1000 €/mes
- Mínimo 2 habitaciones
- Mínimo 1 baño
- Solo anuncios de particulares

## Fuentes utilizadas

- Fotocasa  
- Milanuncios  
- Yaencontre  

## Salida

El actor guarda los resultados en el dataset por defecto de Apify, con objetos tipo:

```json
{
  "source": "Fotocasa",
  "price": 950,
  "rooms": 2,
  "baths": 1,
  "link": "https://www.fotocasa.es/..."
}
