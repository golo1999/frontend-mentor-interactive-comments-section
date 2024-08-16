using Microsoft.AspNetCore.Mvc;
using server.Models.Entities;
using server.Services.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet("email/{emailAddress}")]
        public async Task<ActionResult<User>> GetByEmailAddress([FromRoute] string emailAddress)
        {
            // TODO: Add email validation

            var user = await _userService.GetByEmailAddress(emailAddress);

            if (user is null)
            {
                return NotFound("The user could not be found.");
            }

            return Ok(user);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<User>> GetById([FromRoute] Guid id)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                throw new Exception("The id is not valid.");
            }

            var user = await _userService.GetById(id);

            if (user is null)
            {
                return NotFound("The user could not be found.");
            }

            return Ok(user);
        }
    }
}
