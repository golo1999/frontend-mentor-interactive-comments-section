namespace server.Models.Entities.PaginatedResult
{
    public class Edge<T>
    {
        public required Guid Cursor { get; set; }
        public required T Node { get; set; }
    }
}
