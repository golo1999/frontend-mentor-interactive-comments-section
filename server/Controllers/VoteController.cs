using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Enums;
using server.Services.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class VoteController(IMapper mapper, IUserService userService, IVoteService voteService) : ControllerBase
    {
        private readonly IMapper _mapper = mapper;
        private readonly IUserService _userService = userService;
        private readonly IVoteService _voteService = voteService;

        [HttpPost]
        public async Task<ActionResult<ApiCallResult<Vote>>> Create([FromBody] VoteDTO voteDTO)
        {
            if (voteDTO is null)
            {
                return Ok(new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The voteDTO must not be null.",
                        Type = ApiCallErrorType.NULL_ENTITY
                    }
                });
            }

            if (!Guid.TryParse(voteDTO.CommentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The commentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (voteDTO.ParentCommentId is not null && !Guid.TryParse(voteDTO.ParentCommentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentCommentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (!voteDTO.Type.Equals(VoteType.DOWN) && !voteDTO.Type.Equals(VoteType.UP))
            {
                return Ok(new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The type must be \"DOWN\" (0) or \"UP\" (1).",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            var mappedVote = _mapper.Map<Vote>(voteDTO);
            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Vote>()
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
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            mappedVote.UserId = currentUser.Entity.Id;

            return Ok(await _voteService.Create(currentUser.Entity.Id, mappedVote));
        }

        [HttpDelete("{commentId}")]
        public async Task<ActionResult<ApiCallResult<Vote>>> DeleteByCommentId([FromRoute] Guid commentId, Guid? parentCommentId = null)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The commentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (parentCommentId is not null && !Guid.TryParse(parentCommentId.ToString(), out _))
            {
                return Ok(new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentCommentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Vote>()
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
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return Ok(await _voteService.DeleteByCommentId(currentUser.Entity.Id, commentId, parentCommentId));
        }

        [HttpGet("{commentId}/all")]
        public async Task<ApiCallResult<IEnumerable<Vote>>> GetAllByCommentId([FromRoute] Guid commentId, Guid? parentCommentId = null)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return new ApiCallResult<IEnumerable<Vote>>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The commentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            var votes = await _voteService.GetAllByCommentId(commentId, parentCommentId);

            return new ApiCallResult<IEnumerable<Vote>>()
            {
                Entity = votes.Entity,
                Error = null
            };
        }

        [HttpGet("{commentId}")]
        public async Task<ActionResult<ApiCallResult<Vote>>> GetByCommentId([FromRoute] Guid commentId, Guid? parentCommentId = null)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The commentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            if (parentCommentId is not null && !Guid.TryParse(parentCommentId.ToString(), out _))
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The parentCommentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Vote>()
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
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return Ok(await _voteService.GetByCommentId(currentUser.Entity.Id, commentId, parentCommentId));
        }

        [HttpPatch("{commentId}")]
        public async Task<ActionResult<ApiCallResult<Vote>>> Patch([FromRoute] Guid commentId, [FromBody] JsonPatchDocument<Vote> patch, Guid? parentCommentId = null)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The commentId is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                };
            }

            var currentUserEmailAddress = HttpContext.User.Identity!.Name;

            if (string.IsNullOrEmpty(currentUserEmailAddress))
            {
                return Ok(new ApiCallResult<Vote>()
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
                return new ApiCallResult<Vote>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The current user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return Ok(await _voteService.PatchByCommentId(currentUser.Entity.Id, commentId, patch, parentCommentId));
        }
    }
}
