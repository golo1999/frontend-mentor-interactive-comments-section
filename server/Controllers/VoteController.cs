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
    public class VoteController(IMapper mapper, IUserService userService, IVoteService voteService) : ControllerBase
    {
        private readonly IMapper _mapper = mapper;
        private readonly IUserService _userService = userService;
        private readonly IVoteService _voteService = voteService;

        [HttpPost]
        public async Task<ActionResult<Vote?>> Create([FromBody] VoteDTO voteDTO)
        {
            ArgumentNullException.ThrowIfNull(voteDTO);

            if (!Guid.TryParse(voteDTO.CommentId.ToString(), out _))
            {
                return BadRequest("The commentId is not valid.");
            }

            if (!voteDTO.Type.Equals(VoteType.DOWN) && !voteDTO.Type.Equals(VoteType.UP))
            {
                return BadRequest("The type must be \"DOWN\" (0) or \"UP\" (1).");
            }

            var mappedVote = _mapper.Map<Vote>(voteDTO);
            var currentUser = await _userService.GetByEmailAddress("me@email.com");

            if (currentUser is not null)
            {
                mappedVote.UserId = currentUser.Id;
            }

            var createdVote = await _voteService.Create(mappedVote);

            if (createdVote is null)
            {
                return BadRequest();
            }

            return Ok(createdVote);
        }

        [HttpDelete("{commentId}")]
        public async Task<ActionResult<Vote?>> DeleteByCommentId([FromRoute] Guid commentId)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return BadRequest("The commentId is not valid.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var deletedVote = await _voteService.DeleteByCommentId(currentUser.Id, commentId);

            if (deletedVote is null)
            {
                return NotFound("The vote could not be found.");
            }

            return Ok(deletedVote);
        }

        [HttpGet("{commentId}/all")]
        public async Task<ActionResult<Vote>> GetAllByCommentId([FromRoute] Guid commentId)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return BadRequest("The commentId is not valid.");
            }

            var votes = await _voteService.GetAllByCommentId(commentId);

            return Ok(votes);
        }

        [HttpGet("{commentId}")]
        public async Task<ActionResult<Vote?>> GetByCommentId([FromRoute] Guid commentId)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return BadRequest("The commentId is not valid.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var vote = await _voteService.GetByCommentId(currentUser.Id, commentId);

            if (vote is null)
            {
                return NotFound("The vote could not be found.");
            }

            return Ok(vote);
        }

        [HttpPatch("{commentId}")]
        public async Task<ActionResult<Vote?>> Patch([FromRoute] Guid commentId, [FromBody] JsonPatchDocument<Vote> patch)
        {
            if (!Guid.TryParse(commentId.ToString(), out _))
            {
                return BadRequest("The commentId is not valid.");
            }

            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var patchedVote = await _voteService.PatchByCommentId(currentUser.Id, commentId, patch);

            if (patchedVote is null)
            {
                return NotFound("The vote could not be found.");
            }

            return Ok(patchedVote);
        }
    }
}
