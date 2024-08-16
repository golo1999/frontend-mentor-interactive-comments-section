using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Enums;

namespace server.Services.Service
{
    public interface ICommentService
    {
        public Task<Comment> Create(Comment comment);
        public Task<Comment> Delete(Guid userId, Guid id, Guid? parentId = null);
        public Task<IEnumerable<Comment>> GetAll();
        public Task<Comment> GetById(Guid id, Guid? parentId = null);
        public Task<Comment> Patch(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null);
        public Task<Comment> Vote(VoteType voteType, Guid userId, Guid id, Guid? parentId = null);
    }
}
