export interface ApiErrorBody {
  error?: string
  message?: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
