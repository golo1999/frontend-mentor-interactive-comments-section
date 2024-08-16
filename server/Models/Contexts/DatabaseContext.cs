using Microsoft.EntityFrameworkCore;
using server.Models.Entities;

namespace server.Models.Contexts
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext() { }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Vote> Votes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=localhost;Database=InteractiveCommentsSection;Trusted_Connection=True;Encrypt=False;");
    }
}
