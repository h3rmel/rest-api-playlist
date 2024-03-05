export class CustomError extends Error {
  status: number;
  logging: boolean;

  constructor(message: string, status: number, logging?: boolean) {
    super(message);
    this.name = "CustomError";
    this.status = status;
    this.logging = logging || false;
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, logging?: boolean) {
    super(message, 500, logging);
    this.name = "InternalServerError";
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, logging?: boolean) {
    super(message, 400, logging);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, logging?: boolean) {
    super(message, 404, logging);
    this.name = "NotFoundError";
  }
}
