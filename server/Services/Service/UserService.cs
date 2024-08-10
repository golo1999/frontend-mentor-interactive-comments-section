using server.Models.Entities;
using server.Services.Repository;

namespace server.Services.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<User?> GetByEmailAddress(string emailAddress)
        {
            return await _repository.GetByEmailAddressAsync(emailAddress);
        }

        public async Task<User?> GetById(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }
    }
}
