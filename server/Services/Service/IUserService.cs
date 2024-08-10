using server.Models.Entities;

namespace server.Services.Service
{
    public interface IUserService
    {
        public Task<User?> GetByEmailAddress(string emailAddress);
        public Task<User?> GetById(Guid id);
    }
}
