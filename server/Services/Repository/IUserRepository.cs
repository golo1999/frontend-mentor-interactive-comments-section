using server.Models.Entities;

namespace server.Services.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAddressAsync(string emailAddress);
        Task<User?> GetByIdAsync(Guid id);
    }
}
