using Microsoft.AspNetCore.JsonPatch;
using Newtonsoft.Json;
using server.Models.Entities;
using server.Models.Enums;
using server.Services.Repository;

namespace server.Services.Service
{
    public class VoteService : IVoteService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IVoteRepository _voteRepository;

        public VoteService(ICommentRepository commentRepository, IVoteRepository voteRepository)
        {
            _commentRepository = commentRepository;
            _voteRepository = voteRepository;
        }

        public async Task<Vote> Create(Vote vote)
        {
            return await _voteRepository.CreateAsync(vote);
        }

        public async Task<Vote?> DeleteByCommentId(Guid userId, Guid commentId)
        {
            return await _voteRepository.DeleteByCommentIdAsync(userId, commentId);
        }

        public async Task<Comment?> DownvoteByCommentId(Guid userId, Guid commentId, Guid? parentCommentId)
        {
            var comment = await _commentRepository.GetByIdAsync(commentId, parentCommentId);
            Vote? userVote = await _voteRepository.GetByCommentIdAsync(userId, commentId);

            if (userVote is null)
            {
                var newVote = new Vote
                {
                    CommentId = commentId,
                    Id = Guid.NewGuid(),
                    Type = VoteType.DOWN,
                    UserId = userId
                };
                userVote = await _voteRepository.CreateAsync(newVote);

                var patchDocument = new JsonPatchDocument<Comment>();
                patchDocument.Operations.Add(new() { op = "replace", path = "/score", value = comment?.Score - 1 });
                patchDocument.Operations.Add(new() { op = "add", path = "/votes/-", value = userVote });
                return await _commentRepository.PatchAsync(commentId, parentCommentId, patchDocument);
            }

            var userVoteIndex = comment?.Votes.FindIndex(v => v.CommentId.Equals(commentId) && v.UserId.Equals(userId));
            JsonPatchDocument<Comment> commentPatchDocument;

            if (userVote.Type == VoteType.UP)
            {
                var votePatchDocument = new JsonPatchDocument<Vote>();
                votePatchDocument.Operations.Add(new() { op = "replace", path = "/type", value = VoteType.DOWN });
                var updatedUserVote = await _voteRepository.PatchByCommentIdAsync(userId, commentId, votePatchDocument);

                commentPatchDocument = new JsonPatchDocument<Comment>();
                commentPatchDocument.Operations.Add(new() { op = "replace", path = "/score", value = comment?.Score - 2 });
                commentPatchDocument.Operations.Add(new() { op = "replace", path = $"""/votes/{userVoteIndex}""", value = updatedUserVote });

                return await _commentRepository.PatchAsync(commentId, parentCommentId, commentPatchDocument);
            }

            // userVote.Type == VoteType.DOWN
            await _voteRepository.DeleteByCommentIdAsync(userId, commentId);
            commentPatchDocument = new JsonPatchDocument<Comment>();
            commentPatchDocument.Operations.Add(new() { op = "replace", path = "/score", value = comment?.Score + 1 });
            commentPatchDocument.Operations.Add(new() { op = "remove", path = $"""/votes/{userVoteIndex}""" });

            return await _commentRepository.PatchAsync(commentId, parentCommentId, commentPatchDocument);
        }

        public async Task<IEnumerable<Vote>> GetAllByCommentId(Guid commentId)
        {
            return await _voteRepository.GetAllByCommentIdAsync(commentId);
        }

        public async Task<Vote?> GetByCommentId(Guid userId, Guid commentId)
        {
            return await _voteRepository.GetByCommentIdAsync(userId, commentId);
        }

        public async Task<Vote?> PatchByCommentId(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch)
        {
            return await _voteRepository.PatchByCommentIdAsync(userId, commentId, patch);
        }

        public async Task<Comment?> UpvoteByCommentId(Guid userId, Guid commentId, Guid? parentCommentId)
        {
            var comment = await _commentRepository.GetByIdAsync(commentId, parentCommentId);
            Vote? userVote = await _voteRepository.GetByCommentIdAsync(userId, commentId);

            if (userVote is null)
            {
                var newVote = new Vote
                {
                    CommentId = commentId,
                    Id = Guid.NewGuid(),
                    Type = VoteType.UP,
                    UserId = userId
                };
                userVote = await _voteRepository.CreateAsync(newVote);

                var patchDocument = new JsonPatchDocument<Comment>();
                patchDocument.Operations.Add(new() { op = "replace", path = "/score", value = comment?.Score + 1 });
                patchDocument.Operations.Add(new() { op = "add", path = "/votes/-", value = userVote });
                return await _commentRepository.PatchAsync(commentId, parentCommentId, patchDocument);
            }

            var userVoteIndex = comment?.Votes.FindIndex(v => v.CommentId.Equals(commentId) && v.UserId.Equals(userId));
            JsonPatchDocument<Comment> commentPatchDocument;

            if (userVote.Type == VoteType.DOWN)
            {
                var votePatchDocument = new JsonPatchDocument<Vote>();
                votePatchDocument.Operations.Add(new() { op = "replace", path = "/type", value = VoteType.UP });
                var updatedUserVote = await _voteRepository.PatchByCommentIdAsync(userId, commentId, votePatchDocument);

                commentPatchDocument = new JsonPatchDocument<Comment>();
                commentPatchDocument.Operations.Add(new() { op = "replace", path = "/score", value = comment?.Score + 2 });
                commentPatchDocument.Operations.Add(new() { op = "replace", path = $"""/votes/{userVoteIndex}""", value = updatedUserVote });

                return await _commentRepository.PatchAsync(commentId, parentCommentId, commentPatchDocument);
            }

            // userVote.Type == VoteType.UP
            await _voteRepository.DeleteByCommentIdAsync(userId, commentId);
            commentPatchDocument = new JsonPatchDocument<Comment>();
            commentPatchDocument.Operations.Add(new() { op = "replace", path = "/score", value = comment?.Score - 1 });
            commentPatchDocument.Operations.Add(new() { op = "remove", path = $"""/votes/{userVoteIndex}""" });

            return await _commentRepository.PatchAsync(commentId, parentCommentId, commentPatchDocument);
        }
    }
}
