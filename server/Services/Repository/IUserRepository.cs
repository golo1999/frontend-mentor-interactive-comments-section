using server.Models.Entities;

namespace server.Services.Repository
{
    public interface IUserRepository
    {
        Task<User> CreateAsync(User user);
        Task<User?> GetByEmailAddressAsync(string emailAddress);
        Task<User?> GetByIdAsync(Guid id);
    }
}
