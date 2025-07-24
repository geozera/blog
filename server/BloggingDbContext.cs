using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace server
{
    public class BloggingDbContext : DbContext
    {
        public DbSet<BlogPost> Posts { get; set; }
        public DbSet<BlogAttachment> Attachments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseNpgsql($"Host=postgres;Port=5432;Database=postgres;Username=postgres;Password=blogblog");

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
                .Where(e => e.Entity is BlogPost &&
                       (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                var blog = (BlogPost)entityEntry.Entity;

                blog.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    public class BlogPost
    {
        [Key]
        public int BlogId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }

        public string Author { get; set; }

        public List<BlogAttachment> Attachments { get; set; } = [];
    }

    public class BlogAttachment
    {
        [Key]
        public int Id { get; set; }
        public int BlogPostId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }

    }
}