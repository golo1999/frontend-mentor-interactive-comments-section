namespace server.Models.Entities
{
    public class PaginatedResult<T>
    {
        public required List<Edge<T>> Edges { get; set; }
        public required PageInfo PageInfo { get; set; }
        public int TotalCount { get; set; }
    }
}
