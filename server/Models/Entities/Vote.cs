using server.Models.Enums;

namespace server.Models.Entities
{
    public class Vote
    {
        public Guid CommentId { get; set; }
        public Guid Id { get; set; }
        public VoteType Type { get; set; }
        public Guid UserId { get; set; }
    }
}
