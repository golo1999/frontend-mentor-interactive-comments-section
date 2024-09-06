import { ApiCallErrorType } from "enums";

type ApiCallError = { message: string; type: ApiCallErrorType };

export type ApiCallResult<T> = ApiCallResultSuccess<T> | ApiCallResultError;

type ApiCallResultError = { entity: null; error: ApiCallError };

type ApiCallResultSuccess<T> = { entity: T; error: null };
