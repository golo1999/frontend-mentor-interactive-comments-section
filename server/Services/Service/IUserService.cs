using server.Models.Entities;
using server.Models.Entities.ApiCall;

namespace server.Services.Service
{
    public interface IUserService
    {
        public Task<ApiCallResult<User>> Create(User user);
        public Task<ApiCallResult<User>> GetByEmailAddress(string emailAddress);
        public Task<ApiCallResult<User>> GetById(Guid id);
    }
}
