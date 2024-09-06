export enum ApiCallErrorType {
  ENTITY_ALREADY_EXISTS,
  ENTITY_COULD_NOT_BE_CREATED,
  ENTITY_COULD_NOT_BE_DELETED,
  ENTITY_COULD_NOT_BE_PATCHED,
  ENTITY_NOT_FOUND,
  INVALID_FIELD,
  NOT_ALLOWED,
  NULL_ENTITY,
}

export enum OperationType {
  Add = 0,
  Remove = 1,
  Replace = 2,
  Move = 3,
  Copy = 4,
  Test = 5,
  Invalid = 6,
}
