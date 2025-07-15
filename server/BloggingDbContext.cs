using Microsoft.EntityFrameworkCore;

namespace server
{

    public class BloggingDbContext : DbContext
    {
        public DbSet<Blog> Blogs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseNpgsql($"Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=blogblog");

        public override int SaveChanges()
        {
            SetTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SetTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void SetTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Blog &&
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                var blog = (Blog)entityEntry.Entity;
                if (entityEntry.State == EntityState.Added)
                {
                    blog.CreatedAt = DateTime.UtcNow;
                }

                blog.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    public class Blog
    {
        public int BlogId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string Author { get; set; }
    }
}