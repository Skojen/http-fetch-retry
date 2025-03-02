const {
  FetchResponseError,
  FetchRetryError,
  FetchTimeoutError,
  HostAuthenticationError,
  HostRequestTimeoutError,
} = require('../src/errors.cjs');

describe("Custom Errors", () => {
  test("FetchResponseError should contain correct status code and message", () => {
    const error = new FetchResponseError(404, "Not Found");
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Response error: Not Found.");
    expect(error.serializeErrors()).toEqual([
      { message: "Response error: Not Found." },
    ]);
  });

  test("FetchRetryError should contain correct status code and message", () => {
    const error = new FetchRetryError("Too many retries");
    expect(error.statusCode).toBe(503);
    expect(error.message).toBe("Too many retries");
    expect(error.serializeErrors()).toEqual([{ message: "Too many retries" }]);
  });

  test("FetchTimeoutError should contain correct status code and message", () => {
    const error = new FetchTimeoutError("Request timed out");
    expect(error.statusCode).toBe(408);
    expect(error.message).toBe("Request timed out");
    expect(error.serializeErrors()).toEqual([{ message: "Request timed out" }]);
  });

  test("HostAuthenticationError should contain correct status code and message", () => {
    const error = new HostAuthenticationError("example.com");
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe("Authentication with host example.com failed.");
    expect(error.serializeErrors()).toEqual([
      { message: "Authentication with host example.com failed." },
    ]);
  });

  test("HostRequestTimeoutError should contain correct status code and message", () => {
    const error = new HostRequestTimeoutError("example.com");
    expect(error.statusCode).toBe(504);
    expect(error.message).toBe("Request to host example.com timed out.");
    expect(error.serializeErrors()).toEqual([
      { message: "Request to host example.com timed out." },
    ]);
  });
});
