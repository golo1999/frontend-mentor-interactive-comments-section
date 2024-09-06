using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Models.DTOs;
using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Enums;
using server.Services.Service;
using System.Text.RegularExpressions;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public partial class UserController(IMapper mapper, IUserService userService) : ControllerBase
    {
        private readonly IMapper _mapper = mapper;
        private readonly IUserService _userService = userService;

        private const string EMAIL_PATTERN = @"^\s*[\w\-\+_']+(\.[\w\-\+_']+)*\@[A-Za-z0-9]([\w\.-]*[A-Za-z0-9])?\.[A-Za-z][A-Za-z\.]*[A-Za-z]$";

        [HttpPost]
        public async Task<ActionResult<ApiCallResult<User>>> Create([FromBody] UserDTO userDTO)
        {
            if (userDTO is null)
            {
                return Ok(new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The userDTO must not be null.",
                        Type = ApiCallErrorType.NULL_ENTITY
                    }
                });
            }

            if (string.IsNullOrEmpty(userDTO.EmailAddress))
            {
                return Ok(new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The email address must not be empty.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (!EmailValidationRegex().IsMatch(userDTO.EmailAddress))
            {
                return Ok(new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The email address is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            if (string.IsNullOrEmpty(userDTO.Username))
            {
                return Ok(new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The username must not be empty.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            var mappedUser = _mapper.Map<User>(userDTO);

            return Ok(await _userService.Create(mappedUser));
        }

        [HttpGet("email/{emailAddress}")]
        public async Task<ActionResult<ApiCallResult<User>>> GetByEmailAddress([FromRoute] string emailAddress)
        {
            if (!EmailAddressValidationRegex().IsMatch(emailAddress))
            {
                return Ok(new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The email address is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            return Ok(await _userService.GetByEmailAddress(emailAddress));
        }

        [HttpGet("id/{id}")]
        public async Task<ActionResult<ApiCallResult<User>>> GetById([FromRoute] Guid id)
        {
            if (!Guid.TryParse(id.ToString(), out _))
            {
                return Ok(new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The id is invalid.",
                        Type = ApiCallErrorType.INVALID_FIELD
                    }
                });
            }

            return Ok(await _userService.GetById(id));
        }

        [GeneratedRegex(@"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*@((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))\z")]
        private static partial Regex EmailAddressValidationRegex();
        [GeneratedRegex(EMAIL_PATTERN)]
        private static partial Regex EmailValidationRegex();
    }
}
