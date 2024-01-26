class apiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    stack = "",
    errors = []
  ) {
    super(message);
    this.data = null;
    this.sucess = false;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

export { apiError };
