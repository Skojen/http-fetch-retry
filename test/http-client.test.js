const {
  FetchResponseError,
  FetchRetryError,
  FetchTimeoutError,
} = require("../src/errors.cjs");

const { HttpClient } = require("../src/http-client.cjs");

// Mock global fetch API
global.fetch = jest.fn();

describe("HttpClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetchWithTimeout should return JSON response", async () => {
    const mockResponse = { data: "ok" };
    fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), { status: 200 })
    );

    const response = await HttpClient.fetchWithTimeout({
      url: "https://dummyjson.com/test",
      method: "GET",
      responseType: "JSON",
    });
    console.log(response);

    expect(response).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("fetchWithTimeout should throw FetchTimeoutError if request times out", async () => {
    fetch.mockImplementationOnce(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new FetchTimeoutError("Request timed out")), 500)
        )
    );

    await expect(
      HttpClient.fetchWithTimeout(
        { url: "https://dummyjson.com/test", method: "GET" },
        100
      )
    ).rejects.toThrow(FetchTimeoutError);
  });

  test("fetchWithTimeout should throw FetchResponseError for non-2xx response", async () => {
    fetch.mockResolvedValueOnce(
      new Response("", { status: 404, statusText: "Not Found" })
    );

    await expect(
      HttpClient.fetchWithTimeout({
        url: "https://dummyjson.com/test",
        method: "GET",
      })
    ).rejects.toThrow(FetchResponseError);
  });

  test("fetchWithRetry should retry on transient errors", async () => {
    fetch
      .mockRejectedValueOnce(new FetchTimeoutError("Request timed out")) // 1st attempt fails
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      ); // 2nd attempt succeeds

    const response = await HttpClient.fetchWithRetry(
      { url: "https://dummyjson.com/test", method: "GET" },
      300,
      2
    );

    expect(response).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("fetchWithRetry should throw FetchRetryError after max retries", async () => {
    fetch.mockRejectedValue(new FetchTimeoutError("Request timed out"));

    await expect(
      HttpClient.fetchWithRetry(
        { url: "https://dummyjson.com/test", method: "GET" },
        300,
        2
      )
    ).rejects.toThrow(FetchRetryError);

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
