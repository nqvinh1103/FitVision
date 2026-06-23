const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockResponse<T>(data: T, ms?: number): Promise<T> {
  await delay(ms)
  return data
}
