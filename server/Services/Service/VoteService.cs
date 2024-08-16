using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Enums;
using server.Services.Repository;

namespace server.Services.Service
{
    public class VoteService(Lazy<ICommentService> commentService, IUserService userService, IVoteRepository voteRepository) : IVoteService
    {
        private readonly Lazy<ICommentService> _commentService = commentService;
        private readonly IUserService _userService = userService;
        private readonly IVoteRepository _voteRepository = voteRepository;

        public async Task<Vote> Create(Vote vote)
        {
            if (await _userService.GetById(vote.UserId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            if (vote.ParentCommentId is not null && await _commentService.Value.GetById((Guid)vote.ParentCommentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            var comment = await _commentService.Value.GetById(vote.CommentId, vote.ParentCommentId) ?? throw new Exception("The comment does not exist.");
            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (comment.UserId.Equals(currentUser.Id))
            {
                throw new Exception("You cannot vote your own comment.");
            }

            vote.Id = Guid.NewGuid();

            if (await _voteRepository.GetByIdAsync(vote.Id) is not null)
            {
                throw new Exception("A vote with the same Id already exists.");
            }

            return await _voteRepository.CreateAsync(vote) ?? throw new Exception("The vote could not be created.");
        }

        public async Task<Vote> DeleteByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            if (await _userService.GetById(userId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                throw new Exception("The comment does not exist.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var vote = await GetByCommentId(userId, commentId, parentCommentId);

            if (!vote.UserId.Equals(currentUser.Id))
            {
                throw new Exception("You cannot delete other user's comment.");
            }

            return await _voteRepository.DeleteByCommentIdAsync(userId, commentId, parentCommentId) ?? throw new Exception("The vote could not be deleted.");
        }

        public async Task<IEnumerable<Vote>> GetAllByCommentId(Guid commentId, Guid? parentCommentId = null)
        {
            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                throw new Exception("The comment does not exist.");
            }

            return await _voteRepository.GetAllByCommentIdAsync(commentId, parentCommentId);
        }

        public async Task<Vote> GetByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                throw new Exception("The comment does not exist.");
            }

            if (await _userService.GetById(userId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            return await _voteRepository.GetByCommentIdAsync(userId, commentId, parentCommentId) ?? throw new Exception("The vote does not exist.");
        }

        public async Task<Vote> PatchByCommentId(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch, Guid? parentCommentId = null)
        {
            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                throw new Exception("The comment does not exist.");
            }

            if (await _userService.GetById(userId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (!userId.Equals(currentUser?.Id))
            {
                throw new Exception("You cannot patch other user's vote.");
            }

            return await _voteRepository.PatchByCommentIdAsync(userId, commentId, patch, parentCommentId) ?? throw new Exception("The vote could not be patched.");
        }

        public async Task<Comment> VoteByCommentId(VoteType voteType, Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            if (await _userService.GetById(userId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            var comment = await _commentService.Value.GetById(commentId, parentCommentId) ?? throw new Exception("The comment does not exist.");
            var patchDocument = new JsonPatchDocument<Comment>();
            var score = 0;
            var userVote = await _voteRepository.GetByCommentIdAsync(userId, commentId, parentCommentId);

            if (userVote is null)
            {
                var newVote = new Vote
                {
                    CommentId = commentId,
                    Id = Guid.NewGuid(),
                    ParentCommentId = parentCommentId,
                    Type = voteType,
                    UserId = userId
                };

                if (await _voteRepository.GetByIdAsync(newVote.Id, newVote.ParentCommentId) is not null)
                {
                    throw new Exception("A vote with the same Id already exists.");
                }

                _ = await _voteRepository.CreateAsync(newVote) ?? throw new Exception("The vote could not be created.");
                score = comment.Votes.Aggregate(score, (currentScore, vote) => vote.Type switch
                {
                    VoteType.DOWN => currentScore - 1,
                    VoteType.UP => currentScore + 1,
                    _ => currentScore
                });
                patchDocument.Operations.Add(new() { op = "replace", path = "/score", value = score });

                return await _commentService.Value.Patch(commentId, patchDocument, parentCommentId) ?? throw new Exception("The comment could not be created.");
            }

            if (userVote.Type != voteType)
            {
                var votePatchDocument = new JsonPatchDocument<Vote>();
                votePatchDocument.Operations.Add(new() { op = "replace", path = "/type", value = voteType });

                _ = await _voteRepository.PatchByCommentIdAsync(userId, commentId, votePatchDocument, parentCommentId) ?? throw new Exception("The vote could not be patched.");
            }
            else
            {
                _ = await _voteRepository.DeleteByCommentIdAsync(userId, commentId, parentCommentId) ?? throw new Exception("The vote could not be deleted.");
            }

            score = comment.Votes.Aggregate(score, (currentScore, vote) => vote.Type switch
            {
                VoteType.DOWN => currentScore - 1,
                VoteType.UP => currentScore + 1,
                _ => currentScore
            });
            patchDocument.Operations.Add(new() { op = "replace", path = "/score", value = score });

            return await _commentService.Value.Patch(commentId, patchDocument, parentCommentId) ?? throw new Exception("The comment could not be patched.");
        }
    }
}
