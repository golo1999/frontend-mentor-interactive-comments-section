using Microsoft.EntityFrameworkCore;
using server.Models.Contexts;
using server.Models.Entities;

namespace server.Services.Repository
{
    public class UserRepository(DatabaseContext context) : IUserRepository
    {
        private readonly DatabaseContext _context = context;

        public async Task<User?> GetByEmailAddressAsync(string emailAddress)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.EmailAddress.Equals(emailAddress));
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id.Equals(id));
        }
    }
}
