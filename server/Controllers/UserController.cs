using Microsoft.AspNetCore.Mvc;
using server.Models.Entities;
using server.Services.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("email/{emailAddress}")]
        public async Task<ActionResult<User?>> GetByEmailAddress([FromRoute] string emailAddress)
        {
            var user = await _userService.GetByEmailAddress(emailAddress);

            return Ok(user);
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<User?>> GetById([FromRoute] Guid id)
        {
            var user = await _userService.GetById(id);

            return Ok(user);
        }
    }
}
