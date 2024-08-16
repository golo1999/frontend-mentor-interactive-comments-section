using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using server.Models.Contexts;
using server.Models.Entities;

namespace server.Services.Repository
{
    public class VoteRepository(DatabaseContext context) : IVoteRepository
    {
        private readonly DatabaseContext _context = context;

        public async Task<Vote?> CreateAsync(Vote vote)
        {
            var createdVote = await _context.Votes.AddAsync(vote);

            if (createdVote is null)
            {
                return null;
            }

            await _context.SaveChangesAsync();

            return createdVote.Entity;
        }

        public async Task<Vote?> DeleteByCommentIdAsync(Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            var vote = await GetByCommentIdAsync(userId, commentId, parentCommentId);

            if (vote is null)
            {
                return null;
            }

            _context.Votes.Remove(vote);
            await _context.SaveChangesAsync();

            return vote;
        }

        public async Task<IEnumerable<Vote>> GetAllByCommentIdAsync(Guid commentId, Guid? parentCommentId = null)
        {
            return await _context.Votes.Where(v => v.CommentId.Equals(commentId) && v.ParentCommentId.Equals(parentCommentId)).ToListAsync();
        }

        public async Task<Vote?> GetByCommentIdAsync(Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            return await _context.Votes.FirstOrDefaultAsync(v => v.CommentId.Equals(commentId) && v.ParentCommentId.Equals(parentCommentId) && v.UserId.Equals(userId));
        }

        public async Task<Vote?> GetByIdAsync(Guid id, Guid? parentCommentId = null)
        {
            return await _context.Votes.FirstOrDefaultAsync(v => v.Id.Equals(id) && v.ParentCommentId.Equals(parentCommentId));
        }

        public async Task<Vote?> PatchByCommentIdAsync(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch, Guid? parentCommentId = null)
        {
            var vote = await GetByCommentIdAsync(userId, commentId, parentCommentId);

            if (vote is null)
            {
                return null;
            }

            patch.ApplyTo(vote);
            await _context.SaveChangesAsync();

            return vote;
        }
    }
}
