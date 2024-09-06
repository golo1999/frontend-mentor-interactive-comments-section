using Microsoft.AspNetCore.JsonPatch;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Enums;
using server.Services.Repository;

namespace server.Services.Service
{
    public class VoteService(Lazy<ICommentService> commentService, IUserService userService, IVoteRepository voteRepository) : IVoteService
    {
        private readonly Lazy<ICommentService> _commentService = commentService;
        private readonly IUserService _userService = userService;
        private readonly IVoteRepository _voteRepository = voteRepository;

        public async Task<ApiCallResult<Vote>> Create(Guid userId, Vote vote)
        {
            if (await _userService.GetById(vote.UserId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (vote.ParentCommentId is not null && await _commentService.Value.GetById((Guid)vote.ParentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var comment = await _commentService.Value.GetById(vote.CommentId, vote.ParentCommentId);

            if (comment.Entity is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (comment.Entity.UserId.Equals(userId))
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "You cannot vote your own comment.",
                        Type = ApiCallErrorType.NOT_ALLOWED
                    }
                };
            }

            vote.Id = Guid.NewGuid();

            if (await _voteRepository.GetByIdAsync(vote.Id) is not null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "A vote with the same Id already exists.",
                        Type = ApiCallErrorType.ENTITY_ALREADY_EXISTS
                    }
                };
            }

            var createdVote = await _voteRepository.CreateAsync(vote);

            if (createdVote is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote could not be created.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_CREATED
                    }
                };
            }

            return new ApiCallResult<Vote>()
            {
                Entity = createdVote,
                Error = null
            };
        }

        public async Task<ApiCallResult<Vote>> DeleteByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            if (await _userService.GetById(userId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var vote = await GetByCommentId(userId, commentId, parentCommentId);

            if (vote.Entity is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (!vote.Entity.UserId.Equals(userId))
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "You cannot delete other user's comment.",
                        Type = ApiCallErrorType.NOT_ALLOWED
                    }
                };
            }

            var deletedVote = await _voteRepository.DeleteByCommentIdAsync(userId, commentId, parentCommentId);

            if (deletedVote is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote could not be deleted.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_DELETED
                    }
                };
            }

            return new ApiCallResult<Vote>()
            {
                Entity = deletedVote,
                Error = null
            };
        }

        public async Task<ApiCallResult<IEnumerable<Vote>>> GetAllByCommentId(Guid commentId, Guid? parentCommentId = null)
        {
            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                return new ApiCallResult<IEnumerable<Vote>>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                return new ApiCallResult<IEnumerable<Vote>>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var votes = await _voteRepository.GetAllByCommentIdAsync(commentId, parentCommentId);

            return new ApiCallResult<IEnumerable<Vote>>()
            {
                Entity = votes,
                Error = null
            };
        }

        public async Task<ApiCallResult<Vote>> GetByCommentId(Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
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
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var vote = await _voteRepository.GetByCommentIdAsync(userId, commentId, parentCommentId);

            if (vote is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return new ApiCallResult<Vote>()
            {
                Entity = vote,
                Error = null
            };
        }

        public async Task<ApiCallResult<Vote>> PatchByCommentId(Guid userId, Guid commentId, JsonPatchDocument<Vote> patch, Guid? parentCommentId = null)
        {
            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parent comment does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (await _commentService.Value.GetById(commentId, parentCommentId) is null)
            {
                return new ApiCallResult<Vote>()
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
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            var vote = await GetByCommentId(userId, commentId, parentCommentId);

            if (vote.Entity is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            if (!vote.Entity.UserId.Equals(userId))
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "You cannot patch other user's vote.",
                        Type = ApiCallErrorType.NOT_ALLOWED
                    }
                };
            }

            var patchedVote = await _voteRepository.PatchByCommentIdAsync(userId, commentId, patch, parentCommentId);

            if (patchedVote is null)
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote could not be patched.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_PATCHED
                    }
                };
            }

            return new ApiCallResult<Vote>()
            {
                Entity = patchedVote,
                Error = null
            };
        }

        public async Task<ApiCallResult<Comment>> VoteByCommentId(VoteType voteType, Guid userId, Guid commentId, Guid? parentCommentId = null)
        {
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

            if (parentCommentId is not null && await _commentService.Value.GetById((Guid)parentCommentId) is null)
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

            var comment = await _commentService.Value.GetById(commentId, parentCommentId);

            if (comment.Entity is null)
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

            var patchDocument = new JsonPatchDocument<Comment>();
            var score = 0;
            var userVote = await _voteRepository.GetByCommentIdAsync(userId, commentId, parentCommentId);
            ApiCallResult<Comment> patchedComment;

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
                    return new ApiCallResult<Comment>()
                    {
                        Entity = null,
                        Error = new()
                        {
                            Message = "A vote with the same Id already exists.",
                            Type = ApiCallErrorType.ENTITY_ALREADY_EXISTS
                        }
                    };
                }

                if (await _voteRepository.CreateAsync(newVote) is null)
                {
                    return new ApiCallResult<Comment>()
                    {
                        Entity = null,
                        Error = new()
                        {
                            Message = "The vote could not be created.",
                            Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_CREATED
                        }
                    };
                }

                score = comment.Entity.Votes.Aggregate(score, (currentScore, vote) => vote.Type switch
                {
                    VoteType.DOWN => currentScore - 1,
                    VoteType.UP => currentScore + 1,
                    _ => currentScore
                });
                patchDocument.Operations.Add(new() { op = "replace", path = "/score", value = score });

                patchedComment = await _commentService.Value.Patch(commentId, patchDocument, parentCommentId);

                if (patchedComment.Entity is null)
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
                    Entity = patchedComment.Entity,
                    Error = null
                };
            }

            if (userVote.Type != voteType)
            {
                var votePatchDocument = new JsonPatchDocument<Vote>();
                votePatchDocument.Operations.Add(new() { op = "replace", path = "/type", value = voteType });

                if (await _voteRepository.PatchByCommentIdAsync(userId, commentId, votePatchDocument, parentCommentId) is null)
                {
                    return new ApiCallResult<Comment>()
                    {
                        Entity = null,
                        Error = new()
                        {
                            Message = "The vote could not be patched.",
                            Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_PATCHED
                        }
                    };
                }
            }
            else if (await _voteRepository.DeleteByCommentIdAsync(userId, commentId, parentCommentId) is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The vote could not be deleted.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_DELETED
                    }
                };
            }

            score = comment.Entity.Votes.Aggregate(score, (currentScore, vote) => vote.Type switch
            {
                VoteType.DOWN => currentScore - 1,
                VoteType.UP => currentScore + 1,
                _ => currentScore
            });
            patchDocument.Operations.Add(new() { op = "replace", path = "/score", value = score });

            patchedComment = await _commentService.Value.Patch(commentId, patchDocument, parentCommentId);

            if (patchedComment.Entity is null)
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
                Entity = patchedComment.Entity,
                Error = null
            };
        }
    }
}
