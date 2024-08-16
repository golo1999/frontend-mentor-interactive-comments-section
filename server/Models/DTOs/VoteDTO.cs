using server.Models.Enums;

namespace server.Models.DTOs
{
    public class VoteDTO
    {
        public Guid CommentId { get; set; }
        public Guid? ParentCommentId { get; set; }
        public VoteType Type { get; set; }
    }
}
