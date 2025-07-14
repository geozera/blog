using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using server.Migrations;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BloggingContext>();
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapPost("/blogs", async (BloggingContext db, Blog blog) =>
{
    db.Add(blog);

    await db.SaveChangesAsync();

    return await db.Blogs.Where(b => b.BlogId == blog.BlogId).FirstAsync();
});

app.MapGet("/blogs", async (BloggingContext db) =>
{
    return await db.Blogs.OrderBy(b => b.BlogId).ToListAsync();
});

app.MapGet("/blogs/{id}", async (BloggingContext db, int id) =>
{
    return await db.Blogs.Where(b => b.BlogId == id).ToListAsync();
});

app.MapDelete("/blogs/{id}", async (BloggingContext db, int id) =>
{
    var blogsToDelete = await db.Blogs.Where(b => b.BlogId == id).ToListAsync();

    blogsToDelete.ForEach(b =>
    {
        db.Blogs.Remove(b);
    });

    await db.SaveChangesAsync();

});

app.Run();
