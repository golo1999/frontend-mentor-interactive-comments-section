using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Enums;
using server.Services.Service;
using System.ComponentModel.DataAnnotations;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CommentController(ICommentService commentService, IMapper mapper, IUserService userService) : ControllerBase
    {
        private readonly ICommentService _commentService = commentService;
        private readonly IMapper _mapper = mapper;
        private readonly IUserService _userService = userService;

        [HttpPost]
        public async Task<ActionResult<ApiCallResult<Comment>>> Create([FromBody] CommentDTO commentDTO)
        {
            if (commentDTO is null)
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The commentDTO must not be null.",
                        Type = ApiCallErrorType.NULL_ENTITY
                    }
                });
            }

            if (commentDTO.ParentId is not null && !Guid.TryParse(commentDTO.ParentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (commentDTO.ReplyToUserId is not null && !Guid.TryParse(commentDTO.ReplyToUserId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The replyToUserId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (string.IsNullOrWhiteSpace(commentDTO.Text))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The text must not be empty.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            var mappedComment = _mapper.Map<Comment>(commentDTO);
            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user's email address is null or empty.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                });
            }

            var currentUser = await _userService.GetByEmailAddress(currentUserEmailAddress);

            if (currentUser.Entity is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            mappedComment.UserId = currentUser.Entity.Id;

            var createdComment = await _commentService.Create(currentUser.Entity.Id, mappedComment);

            if (createdComment.Entity is not null)
            {
                if (currentUser.Entity is not null)
                {
                    createdComment.Entity.User = currentUser.Entity;
                }

                if (createdComment.Entity.ReplyToUserId is not null)
                {
                    var replyToUser = await _userService.GetById(createdComment.Entity.ReplyToUserId.Value);
                    createdComment.Entity.ReplyToUser = replyToUser.Entity;
                }
            }

            return Ok(createdComment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiCallResult<Comment>>> Delete([FromRoute] Guid id, Guid? parentId = null)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The id is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });

            }

            if (parentId is not null && !Guid.TryParse(parentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user's email address is null or empty.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                });
            }

            var currentUser = await _userService.GetByEmailAddress(currentUserEmailAddress);

            if (currentUser.Entity is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return Ok(await _commentService.Delete(currentUser.Entity.Id, id, parentId));
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _commentService.GetAll();

            return Ok(comments);
        }

        [HttpGet("all/paginated")]
        public async Task<IActionResult> GetAll([Required] int first, Guid? after = null)
        {
            var comments = await _commentService.GetAll(first, after);

            return Ok(comments);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ApiCallResult<Comment>>> Patch([FromRoute] Guid id, [FromBody] JsonPatchDocument<Comment> patch, Guid? parentId = null)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The id is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (parentId is not null && !Guid.TryParse(parentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            return Ok(await _commentService.Patch(id, patch, parentId));
        }

        [HttpPatch("{id}/vote")]
        public async Task<ActionResult<ApiCallResult<Comment>>> Vote([FromRoute] Guid id, VoteType voteType, Guid? parentId = null)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The id is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            if (parentId is not null && !Guid.TryParse(parentId.ToString(), out _))
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            if (!voteType.Equals(VoteType.DOWN) && !voteType.Equals(VoteType.UP))
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The type must be \"DOWN\" (0) or \"UP\" (1).",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user's email address is null or empty.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                });
            }

            var currentUser = await _userService.GetByEmailAddress(currentUserEmailAddress);

            if (currentUser.Entity is null)
            {
                return new ApiCallResult<Comment>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return Ok(await _commentService.Vote(voteType, currentUser.Entity.Id, id, parentId));
        }
    }
}
