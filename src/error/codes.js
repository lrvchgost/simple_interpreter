export const ErrorCodeEnum = {
  UNEXPECTED_ERROR: "Unexpected error",
  ID_NOT_FOUND: "Identifier not found",
  DUPLICATE_ID: "Duplicate id found",
};

export class ErrorCode {
  constructor(errorCode) {
    this.errorCode = errorCode;
    this.value = ErrorCodeEnum[errorCode] ?? 'none';
  }
}
