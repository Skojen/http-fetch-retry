import {
  FetchResponseError,
  FetchRetryError,
  FetchTimeoutError,
} from './errors.mjs';

export class HttpClient {
  /**
   * Realiza una solicitud HTTP con reintentos en caso de fallos transitorios (timeouts o errores 503).
   * @param {Object} request - Configuración de la solicitud HTTP.
   * @param {string} request.method - Método HTTP (GET, POST, etc.).
   * @param {string} request.url - URL del endpoint.
   * @param {Object} request.headers - Encabezados HTTP.
   * @param {string|Object} request.body - Cuerpo de la solicitud (opcional).
   * @param {string} request.responseType - Tipo de respuesta esperado (JSON, TEXT, BLOB, ARRAY_BUFFER).
   * @param {number} [timeout=30000] - Tiempo máximo de espera en milisegundos.
   * @param {number} [maxRetries=3] - Número máximo de reintentos en caso de fallo.
   * @param {number} [delay=300] - Tiempo de espera entre reintentos en milisegundos.
   * @returns {Promise<any>} - Respuesta procesada según el responseType.
   * @throws {FetchRetryError} - Si se excede el número máximo de reintentos.
   * @throws {FetchResponseError|FetchTimeoutError} - Si ocurre un error no recuperable.
   */
  static async fetchWithRetry(
    request,
    timeout = 30000,
    maxRetries = 3,
    delay = 300
  ) {

    for (let retries = 0; retries < maxRetries; retries++) {
      try {
        return await this.fetchWithRetry(request, timeout);
      } catch (error) {
        if (
          error instanceof FetchTimeoutError ||
          (error instanceof FetchResponseError && error.statusCode === 503)
        ) {
          console.info(
            `Retrying request (${retries + 1}/${maxRetries}): ${
              error.message
            }`
          );
          if (retries === maxRetries - 1) {
            throw new FetchRetryError(
              `Fetch request to ${request.url} failed after ${maxRetries} retries.`
            );
          }
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, delay * Math.pow(2, retries))
          );
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Realiza una solicitud HTTP con un timeout configurable.
   * @param {Object} request - Configuración de la solicitud HTTP.
   * @param {string} request.url - URL del endpoint.
   * @param {string} request.method - Método HTTP (GET, POST, etc.).
   * @param {Object} request.headers - Encabezados HTTP.
   * @param {string|Object} request.body - Cuerpo de la solicitud (opcional).
   * @param {string} request.responseType - Tipo de respuesta esperado (JSON, TEXT, BLOB, ARRAY_BUFFER).
   * @param {number} [timeout=30000] - Tiempo máximo de espera en milisegundos.
   * @returns {Promise<any>} - Respuesta procesada según el responseType.
   * @throws {FetchResponseError} - Si la respuesta no es exitosa (código HTTP diferente de 2xx).
   * @throws {FetchTimeoutError} - Si la solicitud excede el tiempo límite.
   */
  static async fetchWithTimeout(request, timeout = 30000) {
    console.info(`HttpClient.fetchWithTimeout[INI]`);
  
    const controller = new AbortController();
    const id = setTimeout(() => {
      console.warn(`HttpClient.fetchWithTimeout[TIMEOUT] Request to ${request.url} aborted after ${timeout}ms`);
      controller.abort();
    }, timeout);
  
    try {
      console.info(`HttpClient.fetchWithTimeout[01] Request [${JSON.stringify(request)}, timeout = ${timeout}]`);
      const response = await fetch(request.url, {
        method: request.method || "GET",
        headers: request.headers,
        body: request.body,
        signal: controller.signal
      });
  
      clearTimeout(id); // Asegurarse de limpiar el timeout si la respuesta llega a tiempo
  
      if (!response.ok) {
        console.error(`HttpClient.fetchWithTimeout[ERR] HTTP ${response.status} - ${response.statusText}`);
        throw new FetchResponseError(response.status, response.statusText);
      }
  
      const responseType = await this._getResponseType(request.responseType, response);
  
      console.info(`HttpClient.fetchWithTimeout[02] Response [${JSON.stringify(responseType)}]`);
      console.info(`HttpClient.fetchWithTimeout[FIN]`);
      
      return responseType;
    } catch (error) {
      clearTimeout(id); // Limpiar el timeout en caso de error
  
      console.error(`HttpClient.fetchWithTimeout[ERR] [${error}]`);
      
      if (error.name === "AbortError") {
        throw new FetchTimeoutError(`Fetch request to ${request.url} timed out after ${timeout}ms`);
      }
      
      throw error;
    }
  }

  /**
   * Procesa la respuesta en el formato especificado.
   * @param {string} responseType - Tipo de respuesta esperado (JSON, TEXT, BLOB, ARRAY_BUFFER).
   * @param {Response} response - Objeto de respuesta de Fetch API.
   * @returns {Promise<any>} - Respuesta procesada.
   * @throws {Error} - Si ocurre un error en la conversión de la respuesta.
   */
  static async _getResponseType(responseType = "JSON", response) {
    try {
      switch (responseType.toUpperCase()) {
        case "TEXT":
          return response.text();
        case "BLOB":
          return response.blob();
        case "ARRAY_BUFFER":
          return response.arrayBuffer();
        default:
          return response.json();
      }
    } catch (error) {
      throw new Error(
        `Failed to parse response as ${responseType}: ${error.message}`
      );
    }
  }
}
