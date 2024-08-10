using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Enums;
using System.Xml.Linq;

namespace server.Services.Repository
{
    public class VoteRepository : IVoteRepository
    {
        private static readonly List<Vote> _votes = [
            new() {
                CommentId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd24"),
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd00"),
                Type = VoteType.UP,
                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27")
            },
            new() {
                CommentId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd24"),
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd01"),
                Type = VoteType.UP,
                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28")
            },
            new() {
                CommentId = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf70"),
                Id = new Guid("fca3c54d-941c-42c6-8c2a-42a0f97dcf69"),
                Type = VoteType.DOWN,
                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25")
            },
            new() {
                CommentId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd15"),
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd02"),
                Type = VoteType.UP,
                UserId = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25")
            },
        ];

        // TODO: Make this method async after adding DbContext
        public Task<Vote> CreateAsync(Vote vote)
        {
            vote.Id = Guid.NewGuid();

            _votes.Add(vote);

            return Task.FromResult(vote);
        }

        // TODO: Make this method async after adding DbContext
        public Task<Vote?> DeleteByCommentIdAsync(Guid userId, Guid commentId)
        {
            // TODO: Use await after adding DbContext
            var vote = GetByCommentIdAsync(userId, commentId).Result;

            if (vote is not null)
            {
                _votes.Remove(vote);
            }

            return Task.FromResult(vote);
        }

        // TODO: Make this method async after adding DbContext
        public Task<IEnumerable<Vote>> GetAllByCommentIdAsync(Guid commentId)
        {
            var votes = _votes.FindAll(vote => vote.CommentId.Equals(commentId));

            return Task.FromResult(votes.AsEnumerable());
        }

        // TODO: Make this method async after adding DbContext
        public Task<Vote?> GetByCommentIdAsync(Guid userId, Guid commentId)
        {
            var vote = _votes.Find(vote => vote.CommentId.Equals(commentId) && vote.UserId.Equals(userId));

            return Task.FromResult(vote);
        }

        // TODO: Make this method async after adding DbContext
        public Task<Vote?> PatchByCommentIdAsync(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch)
        {
            // TODO: Use await after adding DbContext
            var vote = GetByCommentIdAsync(userId, commentId).Result;

            if (vote is not null)
            {
                patch.ApplyTo(vote);
            }

            return Task.FromResult(vote);
        }
    }
}
