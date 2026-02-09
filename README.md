# Legal Scraper CENDOJ

API para scraping de jurisprudencia española desde CENDOJ usando Puppeteer.

## Endpoints

- `POST /api/search/cendoj` - Buscar sentencias
- `POST /api/sentence/full` - Obtener sentencia completa
- `GET /health` - Health check

## Variables de entorno

- `PORT` - Puerto del servidor (default: 3000)
- `API_KEY` - Clave de autenticación

## Deployment en Railway

1. Conecta este repositorio
2. Configura variable de entorno `API_KEY`
3. Deploy automático
