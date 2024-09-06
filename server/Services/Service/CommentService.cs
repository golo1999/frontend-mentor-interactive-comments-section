using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Entities.PaginatedResult;
using server.Models.Enums;
using server.Services.Repository;

namespace server.Services.Service
{
    public class CommentService(ICommentRepository repository, IUserService userService, Lazy<IVoteService> voteService) : ICommentService
    {
        private readonly ICommentRepository _commentRepository = repository;
        private readonly IUserService _userService = userService;
        private readonly Lazy<IVoteService> _voteService = voteService;

        public async Task<ApiCallResult<Comment>> Create(Guid userId, Comment comment)
        {
            if (comment.ReplyToUserId is not null && await _userService.GetById((Guid)comment.ReplyToUserId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The replyTo user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _userService.GetById(comment.UserId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (comment.ParentId is not null)
            {
                if (await _commentRepository.GetByIdAsync((Guid)comment.ParentId) is null)
                {
                    return new ApiCallResult<Comment>()
                    {
                        Entity = null,
                        Error = new()
                        {
                            Message = "The parent comment does not exist.",
                            Type = ApiCallErrorType.ENTITY_NOT_FOUND
                        }
                    };
                }

                if (comment.ReplyToUserId.Equals(userId))
                {
                    return new ApiCallResult<Comment>()
                    {
                        Entity = null,
                        Error = new()
                        {
                            Message = "You cannot reply to yourself.",
                            Type = ApiCallErrorType.NOT_ALLOWED
                        }
                    };
                }
            }

            comment.DateTime = DateTime.UtcNow;
            comment.Id = Guid.NewGuid();

            if (await _commentRepository.GetByIdAsync(comment.Id, comment.ParentId) is not null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "A comment with the same id already exists.",
                        Type = ApiCallErrorType.ENTITY_ALREADY_EXISTS
                    }
                };
            }

            var createdComment = await _commentRepository.CreateAsync(comment);

            if (createdComment is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment could not be created.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_CREATED
                    }
                };
            }

            return new ApiCallResult<Comment>()
            {
                Entity = createdComment,
                Error = null
            };
        }

        public async Task<ApiCallResult<Comment>> Delete(Guid userId, Guid id, Guid? parentId)
        {
            var comment = await _commentRepository.GetByIdAsync(id, parentId);

            if (comment is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _userService.GetById(userId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (!comment.UserId.Equals(userId))
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "You cannot delete other user's vote.",
                        Type = ApiCallErrorType.NOT_ALLOWED
                    }
                };
            }

            if (parentId is not null && await _commentRepository.GetByIdAsync((Guid)parentId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var deletedComment = await _commentRepository.DeleteAsync(id, parentId);

            if (deletedComment is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment could not be deleted.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_DELETED
                    }
                };
            }

            return new ApiCallResult<Comment>()
            {
                Entity = deletedComment,
                Error = null
            };
        }

        public async Task<IEnumerable<Comment>> GetAll()
        {
            return await _commentRepository.GetAllAsync();
        }

        public async Task<PaginatedResult<Comment>> GetAll(int first, Guid? after = null)
        {
            return await _commentRepository.GetAllAsync(first, after);
        }

        public async Task<ApiCallResult<Comment>> GetById(Guid id, Guid? parentId = null)
        {
            var comment = await _commentRepository.GetByIdAsync(id, parentId);

            if (comment is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return new ApiCallResult<Comment>
            {
                Entity = comment,
                Error = null
            };
        }

        public async Task<ApiCallResult<Comment>> Patch(Guid id, JsonPatchDocument<Comment> patch, Guid? parentId = null)
        {
            if (await _commentRepository.GetByIdAsync(id, parentId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var patchedComment = await _commentRepository.PatchAsync(id, patch, parentId);

            if (patchedComment is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment could not be patched.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_PATCHED
                    }
                };
            }

            return new ApiCallResult<Comment>()
            {
                Entity = patchedComment,
                Error = null
            };
        }

        public async Task<ApiCallResult<Comment>> Vote(VoteType voteType, Guid userId, Guid id, Guid? parentId = null)
        {
            if (parentId is not null && await _commentRepository.GetByIdAsync((Guid)parentId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _userService.GetById(userId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var comment = await _commentRepository.GetByIdAsync(id, parentId);

            if (comment is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (comment.UserId.Equals(userId))
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "You cannot upvote your own comment.",
                        Type = ApiCallErrorType.NOT_ALLOWED
                    }
                };
            }

            var votedComment = await _voteService.Value.VoteByCommentId(voteType, userId, id, parentId);

            if (votedComment.Entity is null)
            {
                var errorMessage = voteType == VoteType.DOWN ? "The comment could not be downvoted." : "The comment could not be upvoted.";

                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = errorMessage,
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_PATCHED
                    }
                };
            }

            return new ApiCallResult<Comment>()
            {
                Entity = votedComment.Entity,
                Error = null
            };
        }
    }
}
