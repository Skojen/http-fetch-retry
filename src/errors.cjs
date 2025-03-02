/**
 * Clase base para errores personalizados.
 */
class CustomError extends Error {
  /**
   * @param {string} message - Mensaje de error.
   */
  constructor(message) {
    super(message);
  }

  /**
   * Serializa los errores en un formato uniforme.
   * @returns {Object[]} - Array de objetos de error.
   */
  serializeErrors() {
    return [{ message: this.message }];
  }
}

/**
 * Error lanzado cuando la respuesta HTTP es incorrecta.
 */
class FetchResponseError extends CustomError {
  /**
   * @param {number} statusCode - Código de estado HTTP.
   * @param {string} statusText - Descripción del error HTTP.
   */
  constructor(statusCode, statusText) {
    super(`Response error: ${statusText}.`);
    this.statusCode = statusCode;
  }
}

/**
 * Error lanzado cuando se superan los intentos de reintento de una solicitud.
 */
class FetchRetryError extends CustomError {
  /**
   * @param {string} message - Mensaje de error.
   */
  constructor(message) {
    super(message);
    this.statusCode = 503;
  }
}

/**
 * Error lanzado cuando una solicitud HTTP excede el tiempo de espera.
 */
class FetchTimeoutError extends CustomError {
  /**
   * @param {string} message - Mensaje de error.
   */
  constructor(message) {
    super(message);
    this.statusCode = 408;
  }
}

/**
 * Error lanzado cuando hay una falla de autenticación con un host.
 */
class HostAuthenticationError extends CustomError {
  /**
   * @param {string} host - Nombre del host con fallo de autenticación.
   */
  constructor(host) {
    super(`Authentication with host ${host} failed.`);
    this.statusCode = 403;
  }
}

/**
 * Error lanzado cuando un host no responde dentro del tiempo límite.
 */
class HostRequestTimeoutError extends CustomError {
  /**
   * @param {string} host - Nombre del host que no respondió.
   */
  constructor(host) {
    super(`Request to host ${host} timed out.`);
    this.statusCode = 504;
  }
}

module.exports = {
  CustomError,
  FetchResponseError,
  FetchRetryError,
  FetchTimeoutError,
  HostAuthenticationError,
  HostRequestTimeoutError
}