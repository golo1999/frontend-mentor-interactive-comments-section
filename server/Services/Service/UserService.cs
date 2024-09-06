using server.Models.Entities;
using server.Models.Entities.ApiCall;
using server.Models.Enums;
using server.Services.Repository;

namespace server.Services.Service
{
    public class UserService(IUserRepository repository) : IUserService
    {
        private readonly IUserRepository _repository = repository;

        public async Task<ApiCallResult<User>> Create(User user)
        {
            if (await _repository.GetByEmailAddressAsync(user.EmailAddress) is not null)
            {
                return new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "A user with the same email address already exists.",
                        Type = ApiCallErrorType.ENTITY_ALREADY_EXISTS
                    }
                };
            }

            user.Id = Guid.NewGuid();

            if (await _repository.GetByIdAsync(user.Id) is not null)
            {
                return new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "A user with the same id already exists.",
                        Type = ApiCallErrorType.ENTITY_ALREADY_EXISTS
                    }
                };
            }

            var createdUser = await _repository.CreateAsync(user);

            if (createdUser is null)
            {
                return new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user could not be created.",
                        Type = ApiCallErrorType.ENTITY_COULD_NOT_BE_CREATED
                    }
                };
            }

            return new ApiCallResult<User>()
            {
                Entity = createdUser,
                Error = null
            };
        }

        public async Task<ApiCallResult<User>> GetByEmailAddress(string emailAddress)
        {
            var user = await _repository.GetByEmailAddressAsync(emailAddress);

            if (user is null)
            {
                return new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return new ApiCallResult<User>()
            {
                Entity = user,
                Error = null
            };
        }

        public async Task<ApiCallResult<User>> GetById(Guid id)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user is null)
            {
                return new ApiCallResult<User>()
                {
                    Entity = null,
                    Error = new()
                    {
                        Message = "The user does not exist.",
                        Type = ApiCallErrorType.ENTITY_NOT_FOUND
                    }
                };
            }

            return new ApiCallResult<User>()
            {
                Entity = user,
                Error = null
            };
        }
    }
}
