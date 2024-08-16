using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Enums;
using server.Services.Repository;

namespace server.Services.Service
{
    public class CommentService(ICommentRepository repository, IUserService userService, Lazy<IVoteService> voteService) : ICommentService
    {
        private readonly ICommentRepository _commentRepository = repository;
        private readonly IUserService _userService = userService;
        private readonly Lazy<IVoteService> _voteService = voteService;

        public async Task<Comment> Create(Comment comment)
        {
            if (comment.ReplyToUserId is not null && await _userService.GetById((Guid)comment.ReplyToUserId) is null)
            {
                throw new Exception("The replyTo user does not exist.");
            }

            if (await _userService.GetById(comment.UserId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (comment.ParentId is not null)
            {
                _ = await _commentRepository.GetByIdAsync((Guid)comment.ParentId) ?? throw new Exception("The parent comment does not exist.");

                if (comment.ReplyToUserId.Equals(currentUser.Id))
                {
                    throw new Exception("You cannot reply to yourself.");
                }
            }

            comment.DateTime = DateTime.UtcNow;
            comment.Id = Guid.NewGuid();

            if (await _commentRepository.GetByIdAsync(comment.Id, comment.ParentId) is not null)
            {
                throw new Exception("A comment with the same id already exists.");
            }

            return await _commentRepository.CreateAsync(comment) ?? throw new Exception("The comment could not be created.");
        }

        public async Task<Comment> Delete(Guid userId, Guid id, Guid? parentId)
        {
            var comment = await _commentRepository.GetByIdAsync(id, parentId) ?? throw new Exception("The comment does not exist.");
            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (!comment.UserId.Equals(currentUser?.Id))
            {
                throw new Exception("You cannot delete other user's vote.");
            }

            if (parentId is not null && await _commentRepository.GetByIdAsync((Guid)parentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            if (await _userService.GetById(userId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            return await _commentRepository.DeleteAsync(userId, id, parentId) ?? throw new Exception("The comment could not be deleted.");
        }

        public async Task<IEnumerable<Comment>> GetAll()
        {
            return await _commentRepository.GetAllAsync();
        }

        public async Task<Comment> GetById(Guid id, Guid? parentId = null)
        {
            return await _commentRepository.GetByIdAsync(id, parentId) ?? throw new Exception("The comment does not exist.");
        }

        public async Task<Comment> Patch(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null)
        {
            return await _commentRepository.PatchAsync(id, patch, parentId) ?? throw new Exception("The comment could not be patched.");
        }

        public async Task<Comment> Vote(VoteType voteType, Guid userId, Guid id, Guid? parentId = null)
        {
            if (parentId is not null && await _commentRepository.GetByIdAsync((Guid)parentId) is null)
            {
                throw new Exception("The parent comment does not exist.");
            }

            if (await _userService.GetById(userId) is null)
            {
                throw new Exception("The user does not exist.");
            }

            var comment = await _commentRepository.GetByIdAsync(id, parentId) ?? throw new Exception("The comment does not exist.");
            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (comment.UserId.Equals(currentUser.Id))
            {
                throw new Exception("You cannot upvote your own comment.");
            }

            var exceptionMessage = voteType == VoteType.DOWN ? "The comment could not be downvoted." : "The comment could not be upvoted.";

            return await _voteService.Value.VoteByCommentId(voteType, userId, id, parentId) ?? throw new Exception(exceptionMessage);
        }
    }
}
