export const ErrorCodeEnum = {
  UNEXPECTED_ERROR: "UNEXPECTED_ERROR",
  ID_NOT_FOUND: "ID_NOT_FOUND",
  DUPLICATE_ID: "DUPLICATE_ID",
  WRONG_PARAMS_NUM: "WRONG_PARAMS_NUM",
};

export const ErrorCodeErrorsEnum = {
  [ErrorCodeEnum.UNEXPECTED_ERROR]: "Unexpected error",
  [ErrorCodeEnum.ID_NOT_FOUND]: "Identifier not found",
  [ErrorCodeEnum.DUPLICATE_ID]: "Duplicate id found",
  [ErrorCodeEnum.WRONG_PARAMS_NUM]: "Wrong number of arguments",
}

export class ErrorCode {
  constructor(errorCode) {
    this.errorCode = errorCode;
    this.value = ErrorCodeErrorsEnum[errorCode] ?? 'none';
  }
}
