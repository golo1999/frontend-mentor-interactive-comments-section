using server.Models.Entities;

namespace server.Services.Repository
{
    public class UserRepository : IUserRepository
    {
        private static readonly List<User> _users = [
            new() {
                EmailAddress = "me@email.com",
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd25"),
                Username = "me"
            },
            new() {
                EmailAddress = "amyrobson@email.com",
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd26"),
                Username = "amyrobson"
            },
            new() {
                EmailAddress = "maxblagun@email.com",
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd27"),
                Username = "maxblagun"
            },
            new() {
                EmailAddress = "ramsesmiron@email.com",
                Id = new Guid("6eb34ef1-018f-4c51-87c8-cab340dbdd28"),
                Username = "ramsesmiron"
            }
        ];

        // TODO: Make this method async after adding DbContext
        public Task<User?> GetByEmailAddressAsync(string emailAddress)
        {
            var user = _users.Find(user => user.EmailAddress == emailAddress);

            return Task.FromResult(user);
        }

        // TODO: Make this method async after adding DbContext
        public Task<User?> GetByIdAsync(Guid id)
        {
            var user = _users.Find(user => user.Id == id);

            return Task.FromResult(user);
        }
    }
}
