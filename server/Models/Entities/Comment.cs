using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models.Entities
{
    public class Comment
    {
        public DateTimeOffset DateTime { get; set; }
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; } = null;
        [NotMapped]
        public required List<Comment> Replies { get; set; } = [];
        public User? ReplyToUser { get; set; } = null;
        public Guid? ReplyToUserId { get; set; }
        public int Score { get; set; } = 0;
        public required string Text { get; set; }
        public required User User { get; set; }
        public required Guid UserId { get; set; }
        public required List<Vote> Votes { get; set; } = [];
    }
}
