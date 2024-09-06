using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Entities.PaginatedResult;
using server.Models.Enums;

namespace server.Services.Service
{
    public interface ICommentService
    {
        public Task<ApiCallResult<Comment>> Create(Guid userId, Comment comment);
        public Task<ApiCallResult<Comment>> Delete(Guid userId, Guid id, Guid? parentId = null);
        public Task<IEnumerable<Comment>> GetAll();
        public Task<PaginatedResult<Comment>> GetAll(int first, Guid? after = null);
        public Task<ApiCallResult<Comment>> GetById(Guid id, Guid? parentId = null);
        public Task<ApiCallResult<Comment>> Patch(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null);
        public Task<ApiCallResult<Comment>> Vote(VoteType voteType, Guid userId, Guid id, Guid? parentId = null);
    }
}
