using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BloggingDbContext>();
builder.Services.AddAntiforgery(options => options.SuppressXFrameOptionsHeader = true);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
var app = builder.Build();
app.UseCors("AllowAngular");

app.UseAntiforgery();

app.MapGet("/", () => "Hello World!");

app.MapPost("/blogs", async ([FromForm] BlogPostRequest postRequest, HttpRequest request, [FromServices] BloggingDbContext db) =>
{
    var post = new BlogPost { Title = postRequest.Title, Content = postRequest.Content, Author = postRequest.Author };
    var files = (await request.ReadFormAsync()).Files.GetFiles("files");

    foreach (var file in files)
    {
        var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "images");
        var filePath = Path.Combine(uploadsDir, fileName);
        var fileUrl = $"{uploadsDir}/{fileName}";

        if (!Directory.Exists(uploadsDir))
            Directory.CreateDirectory(uploadsDir);

        using var stream = File.Create(filePath);

        await file.CopyToAsync(stream);

        post.Attachments.Add(new BlogAttachment
        {
            FileName = fileName,
            FileUrl = fileUrl,
        });
    }

    db.Posts.Add(post);
    await db.SaveChangesAsync();

    return Results.Ok(post);

}).DisableAntiforgery();

app.MapPut("/blogs", async (BloggingDbContext db, BlogPost newBlog) =>
{

    var existingBlog = await db.Posts.Where(b => b.BlogId == newBlog.BlogId).FirstOrDefaultAsync();

    if (existingBlog == null)
        return Results.Problem(
            detail: $"Blog with id ({newBlog?.BlogId.ToString() ?? "unknown"}) was not found.",
            statusCode: StatusCodes.Status404NotFound,
            title: "Not Found"
        );

    existingBlog.Author = newBlog.Author;
    existingBlog.Title = newBlog.Title;
    existingBlog.Content = newBlog.Content;

    await db.SaveChangesAsync();

    return Results.Ok(await db.Posts.Where(b => b.BlogId == newBlog.BlogId).FirstAsync());
});

app.MapGet("/blogs", async (BloggingDbContext db) =>
{
    return Results.Ok(await db.Posts.OrderBy(b => b.BlogId).ToListAsync());
});

app.MapGet("/blogs/{id}", async (BloggingDbContext db, int id) =>
{
    var blog = await db.Posts.FirstOrDefaultAsync(b => b.BlogId == id);

    if (blog == null)
    {
        return Results.Problem(
            detail: $"Blog with id ({id}) was not found.",
            statusCode: StatusCodes.Status404NotFound,
            title: "Not Found"
        );
    }

    return Results.Ok(blog);
});

app.MapDelete("/blogs/{id}", async (BloggingDbContext db, int id) =>
{
    var blogsToDelete = await db.Posts.Where(b => b.BlogId == id).ToListAsync();

    blogsToDelete.ForEach(b => db.Posts.Remove(b));

    await db.SaveChangesAsync();

});

app.Use(async (context, next) =>
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<BloggingDbContext>();
    var isDbAvailable = await db.Database.CanConnectAsync();

    if (!isDbAvailable)
    {
        context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
        await context.Response.WriteAsJsonAsync(new
        {
            title = "Database Connection Failed",
            status = StatusCodes.Status503ServiceUnavailable
        });
    }
    else await next();
});

app.Run();
