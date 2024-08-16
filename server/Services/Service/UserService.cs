using server.Models.Entities;
using server.Services.Repository;

namespace server.Services.Service
{
    public class UserService(IUserRepository repository) : IUserService
    {
        private readonly IUserRepository _repository = repository;

        public async Task<User> GetByEmailAddress(string emailAddress)
        {
            return await _repository.GetByEmailAddressAsync(emailAddress) ?? throw new Exception("The  user does not exist.");
        }

        public async Task<User> GetById(Guid id)
        {
            return await _repository.GetByIdAsync(id) ?? throw new Exception("The user does not exist.");
        }
    }
}
