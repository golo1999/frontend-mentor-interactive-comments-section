using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Services.Repository;

namespace server.Services.Service
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IVoteService _voteService;

        public CommentService(ICommentRepository repository, IVoteService voteService)
        {
            _commentRepository = repository;
            _voteService = voteService;
        }

        public async Task<Comment> Create(Comment comment)
        {
            return await _commentRepository.CreateAsync(comment);
        }

        public async Task<Comment?> Delete(Guid userId, Guid id, Guid? parentId)
        {
            return await _commentRepository.DeleteAsync(userId, id, parentId);
        }

        public async Task<Comment?> Downvote(Guid userId, Guid id, Guid? parentId)
        {
            return await _voteService.DownvoteByCommentId(userId, id, parentId);
        }

        public async Task<IEnumerable<Comment>> GetAll()
        {
            return await _commentRepository.GetAllAsync();
        }

        public async Task<Comment?> Patch(Guid id, Guid? parentId, JsonPatchDocument<Comment> patch)
        {
            return await _commentRepository.PatchAsync(id, parentId, patch);
        }

        public async Task<Comment?> Upvote(Guid userId, Guid id, Guid? parentId)
        {
            return await _voteService.UpvoteByCommentId(userId, id, parentId);
        }
    }
}
