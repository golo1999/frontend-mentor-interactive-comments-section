using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Enums;

namespace server.Services.Service
{
    public interface IVoteService
    {
        public Task<Vote> Create(Vote vote);
        public Task<Vote> DeleteByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null);
        public Task<IEnumerable<Vote>> GetAllByCommentId(Guid commentId, Guid? parentCommentId = null);
        public Task<Vote> GetByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null);
        public Task<Vote> PatchByCommentId(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch, Guid? parentCommentId = null);
        public Task<Comment> VoteByCommentId(VoteType voteType, Guid userId, Guid commentId, Guid? parentCommentId = null);
    }
}
