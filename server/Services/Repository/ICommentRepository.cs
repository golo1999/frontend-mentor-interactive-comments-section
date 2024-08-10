using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;

namespace server.Services.Repository
{
    public interface ICommentRepository
    {
        Task<Comment> CreateAsync(Comment comment);
        Task<Comment?> DeleteAsync(Guid userId, Guid id, Guid? parentId);
        Task<IEnumerable<Comment>> GetAllAsync();
        Task<Comment?> GetByIdAsync(Guid userId, Guid id, Guid? parentId);
        Task<Comment?> PatchAsync(Guid userId, Guid id, Guid? parentId, JsonPatchDocument<Comment> patch);
    }
}
