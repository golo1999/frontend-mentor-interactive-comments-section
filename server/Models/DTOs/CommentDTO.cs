using server.Models.Entities;

namespace server.Models.DTOs
{
    public class CommentDTO
    {
        public Guid? ParentId { get; set; } = null;
        public Guid? ReplyToUserId { get; set; } = null;
        public required string Text { get; set; }
    }
}
