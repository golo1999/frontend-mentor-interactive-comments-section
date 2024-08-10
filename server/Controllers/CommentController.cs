using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.Entities;
using server.Services.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public CommentController(ICommentService commentService, IMapper mapper, IUserService userService)
        {
            _commentService = commentService;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost]
        public async Task<ActionResult<Comment>> Create([FromBody] CommentDTO commentDTO)
        {
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
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var deletedComment = await _commentService.Delete(currentUser.Id, id, parentId);

            return Ok(deletedComment);
        }

        [HttpPatch("{id}/DOWN")]
        public async Task<ActionResult<Comment?>> Downvote([FromRoute] Guid id, Guid? parentId)
        {
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var updatedComment = await _commentService.Downvote(currentUser.Id, id, parentId);

            return Ok(updatedComment);
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
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var comment = await _commentService.Patch(currentUser.Id, id, parentId, patch);

            return Ok(comment);
        }

        [HttpPatch("{id}/UP")]
        public async Task<ActionResult<Comment?>> Upvote([FromRoute] Guid id, Guid? parentId)
        {
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var updatedComment = await _commentService.Upvote(currentUser.Id, id, parentId);

            return Ok(updatedComment);
        }
    }
}
