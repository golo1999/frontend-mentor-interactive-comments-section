using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.Entities;
using server.Models.Enums;
using server.Services.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController(ICommentService commentService, IMapper mapper, IUserService userService) : ControllerBase
    {
        private readonly ICommentService _commentService = commentService;
        private readonly IMapper _mapper = mapper;
        private readonly IUserService _userService = userService;

        [HttpPost]
        public async Task<ActionResult<Comment>> Create([FromBody] CommentDTO commentDTO)
        {
            ArgumentNullException.ThrowIfNull(commentDTO);

            if (commentDTO.ParentId is not null && !Guid.TryParse(commentDTO.ParentId.ToString(), out _))
            {
                return BadRequest("The parentId is not valid.");
            }

            if (commentDTO.ReplyToUserId is not null && !Guid.TryParse(commentDTO.ReplyToUserId.ToString(), out _))
            {
                return BadRequest("The replyToUserId is not valid.");
            }

            if (string.IsNullOrWhiteSpace(commentDTO.Text))
            {
                return BadRequest("The text must not be empty.");
            }

            var mappedComment = _mapper.Map<Comment>(commentDTO);
            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (currentUser is not null)
            {
                mappedComment.UserId = currentUser.Id;
            }

            var createdComment = await _commentService.Create(mappedComment);

            if (createdComment is null)
            {
                return BadRequest();
            }

            if (currentUser is not null)
            {
                createdComment.User = currentUser;
            }

            if (createdComment.ReplyToUserId is not null)
            {
                var replyToUser = await _userService.GetById(createdComment.ReplyToUserId.Value);
                createdComment.ReplyToUser = replyToUser;
            }

            return Ok(createdComment);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Comment?>> Delete([FromRoute] Guid id, Guid? parentId)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return BadRequest("The id is not valid.");
            }

            if (parentId is not null && !Guid.TryParse(parentId.ToString(), out _))
            {
                return BadRequest("The parentId is not valid.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var deletedComment = await _commentService.Delete(currentUser.Id, id, parentId);

            if (deletedComment is null)
            {
                return NotFound("The comment could not be found.");
            }

            return Ok(deletedComment);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var comments = await _commentService.GetAll();

            return Ok(comments);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Vote?>> Patch([FromRoute] Guid id, Guid? parentId, [FromBody] JsonPatchDocument<Comment> patch)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return BadRequest("The id is not valid.");
            }

            if (parentId is not null && !Guid.TryParse(parentId.ToString(), out _))
            {
                return BadRequest("The parentId is not valid.");
            }

            var patchedComment = await _commentService.Patch(id, parentId, patch);

            if (patchedComment is null)
            {
                return NotFound("The comment could not be found.");
            }

            return Ok(patchedComment);
        }

        [HttpPatch("{id}/vote")]
        public async Task<ActionResult<Comment?>> Vote([FromRoute] Guid id, VoteType voteType, Guid? parentId = null)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return BadRequest("The id is not valid.");
            }

            if (parentId is not null && !Guid.TryParse(parentId.ToString(), out _))
            {
                return BadRequest("The parentId is not valid.");
            }

            if (!voteType.Equals(VoteType.DOWN) && !voteType.Equals(VoteType.UP))
            {
                return BadRequest("The type must be \"DOWN\" (0) or \"UP\" (1).");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var votedComment = await _commentService.Vote(voteType, currentUser.Id, id, parentId);

            if (votedComment is null)
            {
                return NotFound("The comment could not be found.");
            }

            return Ok(votedComment);
        }
    }
}
