using Microsoft.AspNetCore.Mvc;
using server.Models.Entities;
using server.Services.Service;
using System.Text.RegularExpressions;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet("email/{emailAddress}")]
        public async Task<ActionResult<User>> GetByEmailAddress([FromRoute] string emailAddress)
        {
            if (!EmailAddressValidationRegex().IsMatch(emailAddress))
            {
                return BadRequest("The email address is invalid.");
            }

            var user = await _userService.GetByEmailAddress(emailAddress);

            if (user is null)
            {
                return NotFound("The user does not exist.");
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
                return NotFound("The user does not exist.");
            }

            return Ok(user);
        }

        [GeneratedRegex(@"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*@((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))\z")]
        private static partial Regex EmailAddressValidationRegex();
    }
}
