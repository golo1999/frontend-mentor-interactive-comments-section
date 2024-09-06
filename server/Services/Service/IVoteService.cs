using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Enums;

namespace server.Services.Service
{
    public interface IVoteService
    {
        public Task<ApiCallResult<Vote>> Create(Guid userId, Vote vote);
        public Task<ApiCallResult<Vote>> DeleteByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null);
        public Task<ApiCallResult<IEnumerable<Vote>>> GetAllByCommentId(Guid commentId, Guid? parentCommentId = null);
        public Task<ApiCallResult<Vote>> GetByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null);
        public Task<ApiCallResult<Vote>> PatchByCommentId(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch, Guid? parentCommentId = null);
        public Task<ApiCallResult<Comment>> VoteByCommentId(VoteType voteType, Guid userId, Guid commentId, Guid? parentCommentId = null);
    }
}
