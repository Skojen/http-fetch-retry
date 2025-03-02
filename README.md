# http-fetch-retry

**http-fetch-retry** es una librería para Node.js que proporciona una clase `HttpClient` con soporte para reintentos automáticos al realizar solicitudes HTTP usando `fetch`. Es útil para manejar solicitudes inestables o cuando se requiere un comportamiento robusto frente a fallos temporales de red.

La librería es compatible tanto con **CommonJS** (CJS) como con **ECMAScript Modules** (ESM).

## Instalación

Puedes instalar la librería usando npm:

```bash
npm install http-fetch-retry
```
## Uso

ESM (ECMAScript Modules)
Si tu proyecto usa ESM (por ejemplo, import), puedes usar la librería de la siguiente manera:

```js
import { HttpClient } from 'http-fetch-retry';

async function makeRequest() {
  try {
    const response = await HttpClient.fetchWithRetry({ url: 'https://api.example.com' });
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

makeRequest();
```
CJS (CommonJS)
Si tu proyecto usa CJS (por ejemplo, require), puedes utilizar la librería de esta manera:

```js
const { HttpClient } = require('http-fetch-retry');

async function makeRequest() {
  try {
    const response = await HttpClient.fetchWithRetry({ url: 'https://api.example.com' });
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

makeRequest();
```
## Métodos
`HttpClient.fetchWithRetry( request = { url }, timeout = 30000, maxRetries = 3, delay = 300)`
Realiza una solicitud HTTP utilizando `fetch` con un mecanismo de reintentos. Si la solicitud falla, se reintentará hasta el número especificado de veces (`maxRetries`), con un retraso entre intentos (`delay`) y por un tiempo de máximo de espera entre petición (`timeout`).

### Parámetros:
- `request` Configuración para la solicitud fetch (objeto). Por ejemplo, `{ method: 'GET', headers: { 'Authorization': 'Bearer token' }, responseType: 'JSON' }`.
- `request.method`: Método HTTP (valor predeterminado: GET).
- `request.url`: La URL a la que se realizará la solicitud (string).
- `request.responseType`: Tipo de respuesta esperado (valor predeterminado: JSON).
- `timeout `: Tiempo máximo de espera en milisegundos (opcional, valor predeterminado: 30000).
- `maxRetries`: Número de intentos en caso de error (opcional, valor predeterminado: 3).
- `delay`: Retraso entre reintentos en milisegundos (opcional, valor predeterminado: 300).

## Testeo
Para correr los tests, asegúrate de tener Jest instalado como dependencia de desarrollo. Luego, ejecuta:
```bash
npm test
```
## Licencia
Distribuido bajo la MIT License. Consulta el archivo `LICENSE` para más detalles.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar la librería, por favor abre un pull request o reporta un issue.