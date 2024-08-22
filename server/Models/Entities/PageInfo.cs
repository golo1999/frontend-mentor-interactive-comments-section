namespace server.Models.Entities
{
    public class PageInfo
    {
        public required Guid? EndCursor;
        public bool HasNextPage;
    }
}
