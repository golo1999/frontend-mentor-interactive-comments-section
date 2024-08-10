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
    public class VoteController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IVoteService _voteService;

        public VoteController(IMapper mapper, IUserService userService, IVoteService voteService)
        {
            _mapper = mapper;
            _userService = userService;
            _voteService = voteService;
        }

        [HttpPost]
        public async Task<ActionResult<Vote?>> Create([FromBody] VoteDTO voteDTO)
        {
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
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var deletedVote = await _voteService.DeleteByCommentId(currentUser.Id, commentId);

            return Ok(deletedVote);
        }

        [HttpGet("{commentId}/all")]
        public async Task<ActionResult<Vote?>> GetAllByCommentId([FromRoute] Guid commentId)
        {
            var votes = await _voteService.GetAllByCommentId(commentId);

            return Ok(votes);
        }

        [HttpGet("{commentId}")]
        public async Task<ActionResult<Vote?>> GetByCommentId([FromRoute] Guid commentId)
        {
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var vote = await _voteService.GetByCommentId(currentUser.Id, commentId);

            return Ok(vote);
        }

        [HttpPatch("{commentId}")]
        public async Task<ActionResult<Vote?>> Patch([FromRoute] Guid commentId, [FromBody] JsonPatchDocument<Vote> patch)
        {
            var currentUser = await _userService.GetByEmailAddress("me@email.com");
            var vote = await _voteService.PatchByCommentId(currentUser.Id, commentId, patch);

            return Ok(vote);
        }
    }
}
