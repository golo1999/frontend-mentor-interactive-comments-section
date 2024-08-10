using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;

namespace server.Services.Service
{
    public interface ICommentService
    {
        public Task<Comment> Create(Comment comment);
        public Task<Comment?> Delete(Guid userId, Guid id, Guid? parentId);
        public Task<Comment?> Downvote(Guid userId, Guid id, Guid? parentId);
        public Task<IEnumerable<Comment>> GetAll();
        public Task<Comment?> Patch(Guid userId, Guid id, Guid? parentId, JsonPatchDocument<Comment> patch);
        public Task<Comment?> Upvote(Guid userId, Guid id, Guid? parentId);
    }
}
