using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;

namespace server.Services.Repository
{
    public interface IVoteRepository
    {
        Task<Vote?> CreateAsync(Vote vote);
        Task<Vote?> DeleteByCommentIdAsync(Guid userId, Guid commentId, Guid? parentCommentId = null);
        Task<IEnumerable<Vote>> GetAllByCommentIdAsync(Guid commentId, Guid? parentCommentId = null);
        Task<Vote?> GetByCommentIdAsync(Guid userId, Guid commentId, Guid? parentCommentId = null);
        Task<Vote?> GetByIdAsync(Guid id, Guid? parentCommentId = null);
        Task<Vote?> PatchByCommentIdAsync(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch, Guid? parentCommentId = null);
    }
}
