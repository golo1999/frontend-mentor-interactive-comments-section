namespace server.Models.Entities
{
    public class Edge<T>
    {
        public required Guid Cursor { get; set; }
        public required T Node { get; set; }
    }
}
