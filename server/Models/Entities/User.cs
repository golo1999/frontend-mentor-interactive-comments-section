namespace server.Models.Entities
{
    public class User
    {
        public required string EmailAddress { get; set; }
        public Guid Id { get; set; }
        public required string Username { get; set; }
    }
}
