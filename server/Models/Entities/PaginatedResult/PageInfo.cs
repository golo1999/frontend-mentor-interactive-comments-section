namespace server.Models.Entities.PaginatedResult
{
    public class PageInfo
    {
        public required Guid? EndCursor;
        public bool HasNextPage;
    }
}
