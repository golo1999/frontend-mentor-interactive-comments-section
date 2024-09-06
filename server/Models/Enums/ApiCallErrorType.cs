namespace server.Models.Enums
{
    public enum ApiCallErrorType
    {
        ENTITY_ALREADY_EXISTS,
        ENTITY_COULD_NOT_BE_CREATED,
        ENTITY_COULD_NOT_BE_DELETED,
        ENTITY_COULD_NOT_BE_PATCHED,
        ENTITY_NOT_FOUND,
        INVALID_FIELD,
        NOT_ALLOWED,
        NULL_ENTITY
    }
}
