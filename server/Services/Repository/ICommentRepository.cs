using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Entities.PaginatedResult;

namespace server.Services.Repository
{
    public interface ICommentRepository
    {
        Task<Comment> CreateAsync(Comment comment);
        Task<Comment?> DeleteAsync(Guid id, Guid? parentId = null);
        Task<IEnumerable<Comment>> GetAllAsync();
        Task<PaginatedResult<Comment>> GetAllAsync(int first, Guid? after = null);
        Task<Comment?> GetByIdAsync(Guid id, Guid? parentId = null);
        Task<Comment?> PatchAsync(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null);
    }
}
