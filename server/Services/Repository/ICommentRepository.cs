using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;

namespace server.Services.Repository
{
    public interface ICommentRepository
    {
        Task<Comment> CreateAsync(Comment comment);
        Task<Comment?> DeleteAsync(Guid userId, Guid id, Guid? parentId = null);
        Task<IEnumerable<Comment>> GetAllAsync();
        Task<Comment?> GetByIdAsync(Guid id, Guid? parentId = null);
        Task<Comment?> PatchAsync(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null);
    }
}
