using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;

namespace server.Services.Repository
{
    public interface IVoteRepository
    {
        Task<Vote?> CreateAsync(Vote vote);
        Task<Vote?> DeleteByCommentIdAsync(Guid userId, Guid commentId);
        Task<IEnumerable<Vote>> GetAllByCommentIdAsync(Guid commentId);
        Task<Vote?> GetByCommentIdAsync(Guid userId, Guid commentId);
        Task<Vote?> GetByIdAsync(Guid id);
        Task<Vote?> PatchByCommentIdAsync(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch);
    }
}
