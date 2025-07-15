using Microsoft.EntityFrameworkCore;
using server;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BloggingDbContext>();
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapPost("/blogs", async (BloggingDbContext db, Blog blog) =>
{
    db.Add(blog);

    await db.SaveChangesAsync();

    return Results.Ok(await db.Blogs.Where(b => b.BlogId == blog.BlogId).FirstAsync());
});

app.MapPatch("/blogs", async (BloggingDbContext db, Blog blog) =>
{

    var existingBlog = await db.Blogs.Where(b => b.BlogId == blog.BlogId).FirstOrDefaultAsync();

    if (blog == null)
        return Results.Problem(
            detail: $"Blog with id ({blog?.BlogId.ToString() ?? "unknown"}) was not found.",
            statusCode: StatusCodes.Status404NotFound,
            title: "Not Found"
        );

    existingBlog = blog;

    await db.SaveChangesAsync();

    return Results.Ok(await db.Blogs.Where(b => b.BlogId == blog.BlogId).FirstAsync());
});

app.MapGet("/blogs", async (BloggingDbContext db) =>
{
    return Results.Ok(await db.Blogs.OrderBy(b => b.BlogId).ToListAsync());
});

app.MapGet("/blogs/{id}", async (BloggingDbContext db, int id) =>
{
    var blog = await db.Blogs.FirstOrDefaultAsync(b => b.BlogId == id);

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
    var blogsToDelete = await db.Blogs.Where(b => b.BlogId == id).ToListAsync();

    blogsToDelete.ForEach(b => db.Blogs.Remove(b));

    await db.SaveChangesAsync();

});

app.MapPost("/blogs/upload", async (HttpRequest request) =>
{
    if (!request.HasFormContentType)
    {
        return Results.Problem(
            detail: "Expected multipart/form-data",
            statusCode: StatusCodes.Status400BadRequest,
            title: "Incorrect Form Content Type"
        );
    }

    var form = await request.ReadFormAsync();
    var file = form.Files.GetFile("file");

    if (file == null || file.Length == 0)
    {
        return Results.Problem(
            detail: "File is missing or empty.",
            statusCode: StatusCodes.Status400BadRequest,
            title: "File Upload Error"
        );
    }

    // Allowed image types
    string[] allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    long maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (file.Length > maxFileSize)
    {
        return Results.Problem(
            detail: "File is too large. Maximum allowed size is 5MB.",
            statusCode: StatusCodes.Status413PayloadTooLarge,
            title: "Payload Too Large"
        );
    }

    if (!allowedImageTypes.Contains(file.ContentType))
    {
        return Results.Problem(
            detail: $"Unsupported file type: {file.ContentType}. Only images are allowed.",
            statusCode: StatusCodes.Status415UnsupportedMediaType,
            title: "Unsupported Media Type"
        );
    }

    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

    // Prevent files without extensions or dangerous inputs
    if (string.IsNullOrWhiteSpace(extension) || extension.Contains(';') || extension.Contains(".."))
    {
        return Results.Problem(
            detail: "Invalid file extension.",
            statusCode: StatusCodes.Status400BadRequest,
            title: "Invalid File"
        );
    }

    var fileName = $"{Guid.NewGuid()}{extension}";

    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "images");
    Directory.CreateDirectory(uploadsFolder);

    var filePath = Path.Combine(uploadsFolder, fileName);

    using (var stream = File.Create(filePath))
    {
        await file.CopyToAsync(stream);
    }

    var fileUrl = $"/uploads/images/{fileName}";

    return Results.Ok(new { url = fileUrl });
});

app.Run();
